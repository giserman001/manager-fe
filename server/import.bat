mongoimport -d test-manager -c users --type=json --file ./config/data/users.json
mongoimport -d test-manager -c counters --type=json --file ./config/data/counters.json
mongoimport -d test-manager -c menus --type=json --file ./config/data/menus.json