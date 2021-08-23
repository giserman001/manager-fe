mongoimport -d test-manager -c users --type=json --file ./config/data/users.json
mongoimport -d test-manager -c counters --type=json --file ./config/data/counters.json
mongoimport -d test-manager -c menus --type=json --file ./config/data/menus.json
mongoimport -d test-manager -c roles --type=json --file ./config/data/roles.json
mongoimport -d test-manager -c depts --type=json --file ./config/data/depts.json