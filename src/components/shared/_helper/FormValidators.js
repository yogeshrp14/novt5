import validator from 'validator';

const FormValidator = {

    validate(element) {

        const isCheckbox = element.type === 'checkbox';
        const value = isCheckbox ? element.checked : element.value;
        const name = element.name;

        if (!name) throw new Error('Input name must not be empty.');

        const param = element.getAttribute('data-param');
        const validations = JSON.parse(element.getAttribute('data-validate'));

        let result = []
        if (validations && validations.length) {
            validations.forEach(m => {
                switch (m) {
                    case 'required':
                        result[m] = isCheckbox ? value === false : validator.isEmpty(value)
                        break;
                    case 'email':
                        result[m] = !validator.isEmail(value)
                        break;
                    case 'number':
                        result[m] = !validator.isNumeric(value)
                        break;
                    case 'integer':
                        result[m] = !validator.isInt(value)
                        break;
                    case 'alphanum':
                        result[m] = !validator.isAlphanumeric(value)
                        break;
                    case 'url':
                        result[m] = !validator.isURL(value)
                        break;
                    case 'equalto':
                        // here we expect a valid ID as param
                        const value2 = document.getElementById(param).value;
                        result[m] = !validator.equals(value, value2)
                        break;
                    case 'minlen':
                        result[m] = !validator.isLength(value, { min: param })
                        break;
                    case 'maxlen':
                        result[m] = !validator.isLength(value, { max: param })
                        break;
                    case 'len':
                        const [min, max] = JSON.parse(param)
                        result[m] = !validator.isLength(value, { min, max })
                        break;
                    case 'min':
                        result[m] = !validator.isInt(value, { min: validator.toInt(param) })
                        break;
                    case 'max':
                        result[m] = !validator.isInt(value, { max: validator.toInt(param) })
                        break;
                    case 'list':
                        const list = JSON.parse(param)
                        result[m] = !validator.isIn(value, list)
                        break;
                    default:
                        throw new Error('Unrecognized validator.');
                }

            })
        }

        return result;
    },
    
    bulkValidate(inputs) {
        let errors = {},
            hasError = false;

        inputs.forEach(input => {
            let result = this.validate(input)
            errors = { ...errors, [input.name]: result }
            if (!hasError) hasError = Object.keys(result).some(val => result[val])
        })

        return {
            errors,
            hasError
        }
    }
}

export default FormValidator;