const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 
                  'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 
                  'я']
const marks = [' ', '.', ',', ':', ';', '!', '?', '-', '/', '\\', '|', '[', ']', '(', ')', '+', 
               '=', '*', '^', '<', '>', '&', '%', '$', '#', '@','\'', '"', '~', '`', '₴', '0', 
               '1', '2', '3', '4', '5', '6', '7', '8', '9']


function binary(number, bits) {
    let zeros = ""
    number = (number >>> 0).toString(2)
    if (number.length < bits) {
        for (let i = 0; i < bits - number.length; i++) {
            zeros += "0"       
        }
    }
    return zeros + number
}

function isUpper(symbol) {
    return symbol == symbol.toUpperCase()
}

function encrypt(text) {
    let result = ""
    for (let i = 0; i < text.length; i++) {
        if (alphabet.indexOf(text[i].toLowerCase()) != -1) {
            if (isUpper(text[i])) {
                result += "01"
            } else {
                result += "00"
            }
            result += binary(alphabet.indexOf(text[i].toLowerCase()) + 1, 6)
        } else if (marks.indexOf(text[i]) != - 1) {
            result += "10"
            result += binary(marks.indexOf(text[i]) + 1, 6)
        }
    }
    return result
}

function decrypt(encrypted_text) {
    let result = ""
    if (result.length % 8 == 0) {
        words = encrypted_text.match(/.{1,8}/g);
        words.forEach(function(word, i, arr) {
            let control_bits = word[0] + word[1]
            let number = word[2] + word[3] + word[4] + word[5] + word[6] + word[7]
            if (word[0] == "0") {
                if (word[1] == "0") {
                    result += alphabet[parseInt(number, 2) - 1]
                } else {
                    result += alphabet[parseInt(number, 2) - 1].toUpperCase()
                }
            } else if (word[0] == "1") {
                result += marks[parseInt(number, 2) - 1]
            }
        });
    }
    return result
}

function clearSelection()
    {
        if (window.getSelection) {window.getSelection().removeAllRanges();}
        else if (document.selection) {document.selection.empty();}
    }

document.addEventListener('DOMContentLoaded', function() {

    const input_text = document.getElementById('user_input')
    const encrypt_btn = document.getElementsByClassName('encrypt_button')[0]
    const decrypt_btn = document.getElementsByClassName('derypt_button')[0]
    const clear_btn = document.getElementsByClassName('clear_button')[0]
    const copy_btn = document.getElementsByClassName('copy_button')[0]

    encrypt_btn.addEventListener('click', function(e) {
        e.preventDefault()
        input_text.value = encrypt(input_text.value)
    })
    
    
    decrypt_btn.addEventListener('click', function(e) {
        e.preventDefault()
        input_text.value = decrypt(input_text.value)
    })
    
    
    clear_btn.addEventListener('click', function(e) {
        e.preventDefault()
        input_text.value = ''
    })


    copy_btn.addEventListener('click', function(e) {
        e.preventDefault()
        input_text.select()
        document.execCommand('copy')
    })

});