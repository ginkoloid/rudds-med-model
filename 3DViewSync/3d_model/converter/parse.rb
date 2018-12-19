# encoding: utf-8

if __FILE__ == $0
  flag = -1
  array = []
  file = File.open(ARGV[0],"r")
  file.each do |str|

    if str.include?('};')
      array.push("}")
      flag = -1
    end

    if flag == 1
      array.push(str)
    end

    if str.include?('var')
      flag = 1
      array.push("{")
    end
  end
  file.close

  File.open(ARGV[0],"w") do |f|
    array.each{|s| f.puts(s)}
  end

end
