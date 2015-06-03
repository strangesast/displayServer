{exec} = require 'child_process'
task 'build', 'Build project and watch', ->
    exec 'coffee --compile --watch ./', (err, stdout, stderr) ->
        throw err if err
        console.log stdout + stderr
