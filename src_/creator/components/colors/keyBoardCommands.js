
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'z') {
    alert('Undo');
  }
});