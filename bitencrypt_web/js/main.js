const alphabet_dict = {
                'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9, 'и': 10, 
                'й': 11, 'к': 12, 'л': 13, 'м': 14, 'н': 15, 'о': 16, 'п': 17, 'р': 18, 'с': 19, 
                'т': 20, 'у': 21, 'ф': 22, 'х': 23, 'ц': 24, 'ч': 25, 'ш': 26, 'щ': 27, 'ъ': 28,
                'ы': 29, 'ь': 30, 'э': 31, 'ю': 32, 'я': 33, 
                'a': 34, 'b': 35, 'c': 36, 'd': 37, 'e': 38, 'f': 39, 'g': 40, 'h': 41, 'i': 42, 
                'j': 43, 'k': 44, 'l': 45, 'm': 46, 'n': 47, 'o': 48, 'p': 49, 'q': 50, 'r': 51, 
                's': 52, 't': 53, 'u': 54, 'v': 55, 'w': 56, 'x': 57, 'y': 58, 'z': 59, 'є': 60, 
                'і': 61, 'ї': 62, 'ґ': 63
               }
               
const marks_dict = { 
             ' ': 1, '.': 2, ',': 3, ':': 4, ';': 5, '!': 6, '?': 7, '-': 8, '/': 9, '\\': 10, 
             '|': 11, '[': 12, ']': 13, '(': 14, ')': 15, '+': 16, '=': 17, '*': 18, '^': 19, 
             '<': 20, '>': 21, '&': 22, '%': 23, '$': 24, '#': 25, '@': 26, '\'': 27, '"': 28, 
             '~': 29, '`': 30, '₴': 31, '0': 32, '1': 33, '2': 34, '3': 35, '4': 36, '5': 37, 
             '6': 38, '7': 39, '8': 40, '9': 41, '{': 42, '}': 43, '\n': 44
            }

const alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 
                  'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 
                  'я', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 
                  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'є', 'і', 'ї', 'ґ']

const marks = [' ', '.', ',', ':', ';', '!', '?', '-', '/', '\\', '|', '[', ']', '(', ')', '+', 
               '=', '*', '^', '<', '>', '&', '%', '$', '#', '@','\'', '"', '~', '`', '₴', '0', 
               '1', '2', '3', '4', '5', '6', '7', '8', '9', '{', '}', '\n']


function binary(number, bits) {
    let zeros = ""
    number = number.toString(2)
    if (number.length < bits)
        for (let i = 0; i < bits - number.length; i++)
            zeros += "0"
    return zeros + number
}

function isUpper(symbol) {
    return symbol == symbol.toUpperCase()
}

function encrypt(text) {
    let result = ""
    for (let i = 0; i < text.length; i++) {
        if (alphabet.indexOf(text[i].toLowerCase()) != -1) {
            isUpper(text[i]) ? result += "01" : result += "00"
            result += binary(alphabet_dict[text[i].toLowerCase()], 6)
        } else if (marks.indexOf(text[i]) != - 1) {
            result += "10"
            result += binary(marks_dict[text[i]], 6)
        }
    }
    return result
}

function decrypt(encrypted_text) {
    let result = "" 
    if (encrypted_text.length % 8 == 0 && new RegExp('[0-1]*').test(encrypted_text.length)) {
        words = encrypted_text.match(/.{1,8}/g);
        words.forEach(function(word) {
            let number = word[2] + word[3] + word[4] + word[5] + word[6] + word[7]
            if (word[0] == "0") {
                if (word[1] == "0")
                    result += alphabet[parseInt(number, 2) - 1]
                else
                    result += alphabet[parseInt(number, 2) - 1].toUpperCase()
            } else if (word[0] == "1")
                result += marks[parseInt(number, 2) - 1]
        })
    } else
        result = '[Зашифрованная последовательность некорректная!]'
    return result
}

function log_info(input_string, result_string, elapsed_time, is_encryption = true) {
    console.groupCollapsed( (is_encryption) ? 'Encryption results' : 'Decryption results' )
    console.log(`Elapsed: ${elapsed_time} s`)
    console.log(`Symbols: ${input_string.length.toLocaleString()}`)
    console.log(`Size: ${result_string.length.toLocaleString()} bytes`)
    if (is_encryption)
        console.log(`Is correct: [${input_string.length == (result_string.length / 8)}]`)
    else
        console.log(`Is correct: [${(input_string.length / 8) == result_string.length}]`)
    console.groupEnd()
}

document.addEventListener('DOMContentLoaded', function() {

    const input_text = document.getElementById('user_input')
    const encrypt_btn = document.getElementsByClassName('encrypt_button')[0]
    const decrypt_btn = document.getElementsByClassName('derypt_button')[0]
    const clear_btn = document.getElementsByClassName('clear_button')[0]
    const copy_btn = document.getElementsByClassName('copy_button')[0]

    let startTime, endTime

    encrypt_btn.addEventListener('click', function(e) {
        e.preventDefault()
        let input_string = input_text.value
        startTime = new Date()
        let result_string = encrypt(input_text.value)
        endTime = new Date()
        input_text.value = result_string
        log_info(input_string, result_string, ((endTime - startTime) / 1000), true)
    })
    
    
    decrypt_btn.addEventListener('click', function(e) {
        e.preventDefault()
        let input_string = input_text.value
        startTime = new Date()
        let result_string = decrypt(input_text.value)
        endTime = new Date()
        input_text.value = result_string
        log_info(input_string, result_string, ((endTime - startTime) / 1000), false)
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