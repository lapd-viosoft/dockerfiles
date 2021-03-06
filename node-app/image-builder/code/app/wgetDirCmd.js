const fs = require('fs');
const path = require('path');

var ignoreRegex = process.env.IGNORE ? new RegExp(process.env.IGNORE) : null;

function wgetDirCmd(rootPath, destination , trimToDestination, prefix)
{
    //Plug app copy in template
    var cmd = prefix ? prefix : "";
    var addedOne = false;
    var acceptExtensionFlag = "";
    
    fs.readdirSync(rootPath).forEach((filename) => {
        if(filename != "node_modules" && (ignoreRegex && (!ignoreRegex.test(filename))))
        {
            if(fs.lstatSync(path.join(rootPath, filename)).isDirectory())
            {
                var cmdForDir = wgetDirCmd(path.join(rootPath, filename), destination, trimToDestination, "");
                if(cmdForDir != "")
                {
                    if((!addedOne))
                    {
                        addedOne = true;
                        cmd += " ";
                    }
                    else
                    {
                        cmd += " && ";
                    }
                    cmd += cmdForDir;
                }
            }
            else
            {
                if(!addedOne)
                {
                    addedOne = true;
                    
                }
                else
                {
                    cmd += " && ";
                }
                
                acceptExtensionFlag = path.extname(filename) != '' ? '-A'+path.extname(filename) : '';
                
                cmd += ("mkdir -p "+rootPath.replace(trimToDestination, destination)+" && wget 'http://"+process.env.DOCKER_LOCALHOST+":"+process.env.EXTERNAL_PORT+path.join(rootPath, filename) + "' --output-document=\"" + path.join(destination, path.join(rootPath, filename).replace(trimToDestination+"/", ""))+"\"");
            }
        }
    });
    
    return cmd;
}

module.exports = wgetDirCmd;
