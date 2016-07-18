require 'http'
require 'multi_json'

def errorCheck(res)
    if (res.code == 429)
        raise
    end
end

smooch_uri = "https://api.smooch.io/v1/appusers/"        #c2d45bd00a85a52593f645e6"

#main statement
obj = {:properties => {:state => 'hook'}}
res = HTTP.headers("app-token" => "0kntojv4o8o48nq92p1w9g3by").put(smooch_uri+smooch_id, :json)


front_uri = "https://api2.frontapp.com/contacts"
front_token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiKiJdLCJpc3MiOiJmcm9udCIsInN1YiI6ImFuZGNoaWxsX2lvIn0.mlpoMLQSuCBw49ZwZY4fqcgqwTAUPZhwKYs98Tj0FPw"
#edit token

list = {}

begin
    res = nil
    begin
        res = HTTP.auth("Bearer #{front_token}").get(front_uri)
        errorCheck(res)
    rescue
        sleep(res["Retry-After"].to_i)
        retry
    end
    list = MultiJson.load(res.body)
    list["_results"].each { |entry|
        if (entry["handles"][0]["source"]== "smooch")
            smooch_id = entry["handles"][0]["handle"]
            obj = {:properties => {:state => 'hook'}}
            res = HTTP.headers("app-token" => "0kntojv4o8o48nq92p1w9g3by").put(smooch_uri+smooch_id, :json => obj)
        end
    }
    front_uri = list["_pagination"]["next"]

end while (list["_pagination"]["next"] != nil)
