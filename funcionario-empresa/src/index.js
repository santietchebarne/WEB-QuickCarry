const tokenLocalStorage = localStorage.getItem('token')

if (!tokenLocalStorage) {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const refresh_token = urlParams.get('refresh')
    localStorage.setItem('token', token)
}

location.href = '/html/profile.html'