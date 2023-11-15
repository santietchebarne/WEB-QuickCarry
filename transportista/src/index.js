const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token')

if (!token) {
    location.href = 'http://localhost:5000'
} else {
    localStorage.setItem('token', token)
    location.href = '/html/profile.html'
}