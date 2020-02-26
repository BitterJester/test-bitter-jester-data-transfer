compress-archive -path '..\test-bitter-jester-data-transfer' -destinationpath '.\test-bitter-jester-data-transfer.zip' -compressionlevel optimal
aws cloudformation deploy --template-file ./template.yml --stack-name "write-to-s3-from-jotform" --capabilities CAPABILITY_IAM
