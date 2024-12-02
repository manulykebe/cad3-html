require 'sketchup.rb'
require "tempfile"
require 'json'

file = "export_cad3.rb"

# Ensure the file is always reloaded
if file_loaded?(file)
  $loaded_files.delete(file)
  puts "#{file} unloaded."
end

module CAD3
  module Export

    @prec = 5

    def self.w(v)
      (v * 10 ** @prec).to_i.to_s(36)
    end

    def self.u(v)
      v.to_i.to_s(36)
    end

    def valid_json?(string)
      JSON.parse(string)
      true
    rescue JSON::ParserError
      false
    end

    # Function to check if a vertex exists in the array of vertices
    # If it doesn't exist, add it and return the new index
    # If it exists, return its index
    def self.vertex_lookup(vertex, vertices_array)
      index = vertices_array.index(vertex)
      if index.nil?
        vertices_array << vertex
        u(vertices_array.length - 1)
      else
        u(index)
      end
    end

    def self.loop_instances(entities, transformation, output_array)
      instances = entities.find_all { |e| e.is_a?(Sketchup::ComponentInstance) or e.is_a?(Sketchup::Group) }
      instances.each do |instance|
        instance_transformation = transformation * instance.transformation

        vertices_array = []
        v3indices_array = []
        edges_array = []

        attributes = {}
        dict = instance.attribute_dictionary('cad3')
        if dict
          dict.each_pair do |key, value|
            # Check if the value is a valid JSON string
            begin
              parsed_value = JSON.parse(value)
              # Check if the parsed value is an Array or Hash
              if parsed_value.is_a?(Array) || parsed_value.is_a?(Hash)
                attributes[key] = parsed_value
              else
                attributes[key] = value
              end
            rescue JSON::ParserError
              # If it's not a valid JSON, store it as a string
              attributes[key] = value
            rescue TypeError
              # Handle any other type-related errors explicitly
              attributes[key] = value.to_s
            end
          end
        end

        instance.definition.entities.grep(Sketchup::Face).each do |face|
          mesh = face.mesh 5

          (1..mesh.count_polygons).each do |j|
            pts = mesh.polygon_points_at(j)

            v3indices = pts.map do |pt|
              transformed_pt = pt.transform(instance_transformation)
              vertex = "#{w(transformed_pt.x)},#{w(transformed_pt.y)},#{w(transformed_pt.z)}"
              vertex_lookup(vertex, vertices_array)
            end.join(",")

            v3indices_array << v3indices
          end
        end

        instance.definition.entities.grep(Sketchup::Edge).each do |edge|
          next unless edge.visible? && edge.layer.visible? && !edge.soft? && !edge.smooth?

          start_pt = edge.start.position.transform(instance_transformation)
          end_pt = edge.end.position.transform(instance_transformation)

          start_vertex = "#{w(start_pt.x)},#{w(start_pt.y)},#{w(start_pt.z)}"
          end_vertex = "#{w(end_pt.x)},#{w(end_pt.y)},#{w(end_pt.z)}"

          start_index = vertex_lookup(start_vertex, vertices_array)
          end_index = vertex_lookup(end_vertex, vertices_array)

          edges_array << "#{start_index},#{end_index}"
        end

        vertices_content = vertices_array.join("|")
        v3indices_content = v3indices_array.join("|")
        edges_content = edges_array.join("|")

        nested_entities = instance.entities.grep(Sketchup::ComponentInstance) + instance.entities.grep(Sketchup::Group)
        nested_names = nested_entities.map { |e| e.name.to_s }.join('|')

        output = <<~OUTPUT
          {
            "id": "#{instance.name}",
            "children": "#{nested_names}",
            "pos": "#{w(instance_transformation.origin.x)},#{w(instance_transformation.origin.y)},#{w(instance_transformation.origin.z)}",
            "rot": "#{w(Math.atan2(instance_transformation.yaxis.z, instance_transformation.yaxis.y))},#{w(Math.atan2(-instance_transformation.xaxis.z, Math.sqrt(instance_transformation.xaxis.y**2 + instance_transformation.xaxis.x**2)))},#{w(Math.atan2(instance_transformation.xaxis.y, instance_transformation.xaxis.x))}",
            "scale": "#{w(instance_transformation.xaxis.length)},#{w(instance_transformation.yaxis.length)},#{w(instance_transformation.zaxis.length)}",
            "v": "#{vertices_content}",
            "f": "#{v3indices_content}",
            "ed": "#{edges_content}"
        OUTPUT

        # Conditionally add the userData only if attributes are not empty
        unless attributes.empty?
        output += <<~USERDATA
          ,"userData": #{JSON.pretty_generate(attributes)}
        USERDATA
        end

        output += "}"

        output_array << output.strip

        loop_instances(instance.definition.entities, instance_transformation, output_array)
      end
    end

    def self.export(createFile = true)
      puts "Exporting CAD3.v12..."
      clear

      CAD3::Metadata::clean_model_info

      CAD3::Metadata::set_node_names(true)
      entities = Sketchup.active_model.entities
      transformation = Geom::Transformation.scaling(1.inch.to_cm)
      output_array = []
      loop_instances(entities, transformation, output_array)

      filename = Sketchup.active_model.description.sub(" ", "_")
      filename = "output" if filename.nil?
      filename = filename.sub("/", "/cad3/")

      full_filename = "C:/GitHub/assets/#{filename}.json"

      FileUtils.mkdir_p(File.dirname(full_filename)) unless Dir.exist?(File.dirname(full_filename))

      timestamp = Time.now.strftime("%Y-%m-%d %H:%M:%S")

      # Build JSON content string
      content = "{"
      content += "\"v\":#{VERSION}.#{@prec},"
      content += "\"model\":\"#{Sketchup.active_model.description}\","
      content += "\"timestamp\":\"#{timestamp}\","
      content += "\"g\":["
      content += output_array.join(',')
      content += "]}"

      if createFile
        File.open(full_filename, "w") do |file|
          file.write(content)
        end

        success = system("cscript C:\\GitHub\\cad3\\Sketchup\\CAD3\\bin\\compactJSON.vbs \"#{full_filename}\"")
        if success
          puts "Compressed JSON:            OK"
        else
          puts "Error occurred compressing JSON."
        end
        base_dir = File.dirname(full_filename)
        Dir.mkdir(base_dir) unless Dir.exist?(base_dir)

        file2zip = "#{File.basename(full_filename, ".*")}.json"
        zipfile = "#{File.basename(full_filename, ".*")}.cd3"

        success = system("c: && cd \"#{base_dir}\" && \"C:/GitHub/cad3/GNU/zip\" \"#{zipfile}\" \"#{file2zip}\"")

        puts "File created:               #{full_filename}"

        if success
          puts "Stamp:                      #{timestamp}"
          puts "File successfully zipped:   #{zipfile}"
          File.delete(full_filename) # TODO
          puts "Original file deleted:      yes"
          puts
        else
          puts "Error occurred while zipping the file."
        end
      else
        begin
          # JSON.pretty_generate(JSON.parse(content))
          JSON.parse(content)
        rescue JSON::ParserError => e
          puts "JSON parsing error: #{e.message}"
          return content # fallback to raw content
        end
      end
    end # export()

    # Add a menu item
      unless defined?($menu_cad3) && $menu_cad3
        $menu_cad3 = UI.menu("Plugins").add_submenu("CAD3")
      end
      unless defined?($menu_cad3_export) && $menu_cad3_export
        $menu_cad3_export = $menu_cad3.add_submenu("Export")
      end

      # unless defined?($context_cad3) && $context_cad3
      #   UI.add_context_menu_handler do |popup|
      #     $context_cad3 = popup.add_submenu('CAD3')
      #   end
      # end

      $menu_cad3_export.add_item("Export CAD3.v12") { export() }
      # $context_cad3.add_item("Export CAD3.v12") { export() }

      file_loaded("export_cad3.rb")

  end # module Export

end # module CAD3
