export function createWhatsAppLink(numero, mensaje) {
    const cleanNumber = String(numero || '').replace(/\D/g, '')
    const encodedMessage = encodeURIComponent(mensaje || '')

    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}

export function createCourseInquiryMessage(companyName, courseName) {
    return `Hola ${companyName}, me interesa el ${courseName}. Quiero saber horarios, precio, requisitos y cuál libreta incluye.`
}

export function createCategoryInquiryMessage(companyName, categoryName) {
    return `Hola ${companyName}, quiero información sobre ${categoryName}. ¿Cuánto cuesta, qué requisitos tiene y qué incluye?`
}

export function createPropertyInquiryMessage(companyName, propertyName) {
    return `Hola ${companyName}, me interesa la propiedad ${propertyName}. Quiero saber detalles y disponibilidad.`
}

export function createGeneralInquiryMessage(companyName) {
    return `Hola ${companyName}, quiero información general: horarios, ubicacion, y opciones de pago.`
}