rm -rf bitter-jester-data-manager-etl.zip
zip -r bitter-jester-data-manager-etl.zip . -x '.idea/**' -x '.git/**'
aws s3 cp ./bitter-jester-data-manager-etl.zip "s3://bitter-jester-test/bitter-jester-data-transfer/test-bitter-jester-data-transfer.zip"
aws cloudformation deploy --template-file ./template.yml --stack-name "bitter-jester-data-manager-etl" --capabilities CAPABILITY_IAM --parameter-overrides AwsAccessID=${AWS_ACCESS_ID} AwsSecretKey=${AWS_SECRET_KEY} JotformApiKey=${JOTFORM_API_KEY}