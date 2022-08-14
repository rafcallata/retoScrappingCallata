export const mockProfiles = [
    
  ];
  
  export const mockResponseProfiles = mockProfiles.map(profile => ({
    raw       : profile,
    profileVar: profile.match(/urn.+/)[0].replace('miniP','p').replace('Afs','Afsd')
  }));