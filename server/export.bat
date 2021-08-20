mongoexport  -d  test-manager  -c  users  --type=json  -o  ./config/data/users.json
mongoexport  -d  test-manager  -c  counters  --type=json  -o  ./config/data/counters.json
mongoexport  -d  test-manager  -c  menus  --type=json  -o  ./config/data/menus.json
mongoexport  -d  test-manager  -c  roles  --type=json  -o  ./config/data/roles.json