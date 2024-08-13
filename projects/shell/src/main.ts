fetch('assets/settings.json')
  .then(async (response: Response) => {
    const data = await response.json();
    sessionStorage.setItem('settings', JSON.stringify(data));
    return import('./bootstrap')
      .catch(err => console.error(err));
  }).catch(err => console.error(err));


