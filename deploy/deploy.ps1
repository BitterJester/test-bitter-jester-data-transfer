#$compress = @{
 #   Path= ".\node_modules", ".\writeToS3FromJotFormLambdaHandler.js", ".\writeToS3FromJotForm.js", ".\.env", ".\package.json", ".\package-lock.json"
  #  CompressionLevel = "Fastest"
   # DestinationPath = ".\deploy\test-bitter-jester-data-transfer.zip"
    #}
#Compress-Archive @compress -Force
$version = 1
aws s3 cp ./deploy/test-bitter-jester-data-transfer.zip "s3://bitter-jester-test/write-to-s3-from-jotform/test-bitter-jester-data-transfer-${version}.zip"
aws cloudformation deploy --template-file ./template.yml --stack-name "write-to-s3-from-jotform" --capabilities CAPABILITY_IAM
