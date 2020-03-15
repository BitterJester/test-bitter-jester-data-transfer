#$compress = @{
 #   Path= ".\node_modules", ".\writeToS3FromJotFormLambdaHandler.js", ".\writeToS3FromJotForm.js", ".\.env", ".\package.json", ".\package-lock.json"
  #  CompressionLevel = "Fastest"
   # DestinationPath = ".\deploy\test-bitter-jester-data-transfer.zip"
    #}
#Compress-Archive @compress -Force
aws s3 cp ./deploy/test-bitter-jester-data-transfer.zip "s3://bitter-jester-test/bitter-jester-data-transfer/test-bitter-jester-data-transfer.zip"
aws cloudformation deploy --template-file ./template.yml --stack-name "write-to-s3-from-jotform" --capabilities CAPABILITY_IAM
