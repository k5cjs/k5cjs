#!/bin/bash

mkdir -p reports

mv coverage/rxjs/coverage-final.json reports/rxjs.json
mv coverage/forms/coverage-final.json reports/forms.json
mv coverage/selection-model/coverage-final.json reports/selection.json
mv coverage/select/coverage-final.json reports/select.json
mv coverage/scroll/coverage-final.json reports/scroll.json
mv coverage/tables/coverage-final.json reports/tables.json
mv coverage/control/coverage-final.json reports/control.json
mv coverage/input/coverage-final.json reports/input.json
mv coverage/textarea/coverage-final.json reports/textarea.json
mv coverage/form-field/coverage-final.json reports/form.json
mv coverage/dropdown/coverage-final.json reports/dropdown.json
mv coverage/cal/coverage-final.json reports/cal.json
mv coverage/form-error/coverage-final.json reports/form.json
mv coverage/animations/coverage-final.json reports/animations.json
mv coverage/store/coverage-final.json reports/store.json
mv coverage/types/coverage-final.json reports/types.json

mkdir -p .nyc_output

./node_modules/.bin/nyc merge reports .nyc_output/out.json

mkdir -p coverage/merged

./node_modules/.bin/nyc report --reporter html --reporter json-summary --report-dir coverage/merged
