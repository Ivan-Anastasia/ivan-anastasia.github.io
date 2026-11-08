/** Единственный источник персональных данных. null = данные ещё не предоставлены. */
export const wedding = {
  groom: 'Иван', bride: 'Анастасия', initials: null,
  date: '2027-07-17T16:00:00+03:00', // ISO 8601 с часовым поясом: YYYY-MM-DDTHH:mm:ss+03:00
  timeZone: 'Europe/Moscow', startTime: '16:00',
  venue: { name: 'Ресторан «Моне»', room: 'Терраса', address: 'Нижневолжская наб., 1в, Нижний Новгород', mapsUrl: null, coordinates: null, embedUrl: null },
  images: { channelEnvelope:'/assets/channel-open-envelope.webp', weddingScene:'/assets/tray-flat-ivory-paper.webp', envelope:'/assets/envelope-paper-photo.webp', couple:'/assets/couple-meadow-v79.png', couplePlaceholder:'/assets/wedding-still-life.webp', paper: '/assets/paper-pearl.webp', tray: '/assets/tray.webp', fashion: '/assets/fashion.webp', pearlThread:'/assets/pearl-thread-photo.webp', pearlArc:'/assets/pearl-arc-white.webp', pearlHearts:'/assets/pearl-hearts-photo.webp', backdrop:'/assets/editorial-clouds.webp', og: '/assets/wedding-cover-v25.png' },
  pearlTrail: { enabled:false, image:'/assets/pearl-arc-white.webp', width:1600, height:553, samples:[[212,235],[350,323],[444,375],[964,438]] },
  intro: { duration: 4800, enabled: true },
  music: { src: '/assets/tri-dnya-dozhdya-krasota-quiet-v80.mp3', label: 'Три дня дождя — Красота' },
  adultsOnly: { title:'Только для взрослых', subtitle:'Вечер без забот', message:'Мы планируем свадьбу только для взрослых. Пожалуйста, приходите без детей — этот вечер мы хотим разделить с вами.' },
  quote: 'Любовь — это когда две истории становятся одной',
  invitation: [
    'Вы получили это приглашение, потому что занимаете особенное место в нашей жизни.',
    'Совсем скоро наступит один из самых счастливых и трогательных дней для нас, и мы хотим разделить его именно с вами.',
    'Нам будет бесконечно приятно видеть вас рядом, разделить искренние улыбки, счастливые мгновения и тепло этого праздника.',
    'Пусть этот день станет ещё одним прекрасным воспоминанием, которое мы создадим вместе.'
  ],
  wishes: [
    'Самое главное для нас — это ваше присутствие в этот особенный день!',
    'Если вы захотите порадовать нас подарком, мы будем благодарны за вклад в осуществление нашей общей мечты, который удобно разместится в конверте.',
    'А вместо цветов, красота которых так недолговечна, подарите нам ваши тёплые улыбки, объятия и искренние пожелания.',
    'Именно эти моменты мы будем хранить в сердце долгие годы.'
  ],
  dressText: 'Мы будем счастливы, если вы поддержите цветовую палитру нашей свадьбы при выборе праздничного образа. Пусть ваши наряды станут частью тёплой и гармоничной атмосферы этого особенного дня.',
  shoeText: 'Просим вас уделить особое внимание выбору обуви. Будем признательны, если вы отдадите предпочтение элегантным туфлям, лоферам или лаконичным кедам вместо спортивных кроссовок. Так ваш образ гармонично дополнит атмосферу нашего праздника.',
  timeline: [
    { time: '16:00', title: 'Сбор гостей. Фуршет' },
    { time: '16:30', title: 'Церемония' },
    { time: '17:30', title: 'Банкет' },
    { time: '20:15', title: 'Дискотека' }
  ],
  palette: [ { name:'Чёрный', hex:'#141414' }, { name:'Шоколадный',hex:'#604C3D' }, { name:'Кофейный',hex:'#917667' }, { name:'Бежевый',hex:'#DAD1BC' }, { name:'Пудровый',hex:'#E2D5CB' }, { name:'Шалфейный',hex:'#A8B9A1' }, { name:'Оливковый',hex:'#64714E' } ],
  gallery: [ { src:'/assets/fashion.webp',title:'Тёплые оттенки. Элегантные силуэты.',description:'Иллюстративные образы: шоколадное макси, бежевый костюм, оливковое миди и костюм цвета эспрессо.' } ],
  rsvp: {
    schemaVersion: 1,
    questions: [
      { id:'guestName',type:'text',label:'Ваше имя и фамилия',required:true,maxLength:120,autocomplete:'name' },
      { id:'attending',type:'radio',label:'Сможете ли вы присутствовать на нашей свадьбе?',required:true,options:[{value:'yes',label:'С радостью приду!'},{value:'no',label:'К сожалению, не смогу'}] },
      { id:'companion',type:'radio',label:'Планируете ли вы прийти с сопровождающим?',required:true,showWhen:{field:'attending',value:'yes'},options:[{value:'yes',label:'Да'},{value:'no',label:'Нет'}] },
      { id:'drinks',type:'checkbox',label:'Какие напитки вы предпочитаете?',showWhen:{field:'attending',value:'yes'},options:[{value:'wine',label:'Вино'},{value:'sparkling',label:'Игристое'},{value:'spirits',label:'Крепкие напитки'},{value:'soft',label:'Безалкогольные'}] },
      { id:'wishes',type:'textarea',label:'Ваши пожелания',maxLength:2000,placeholder:'Что нам стоит знать, чтобы вам было комфортно?' }
    ]
  },
  seo: { title:'Свадебное приглашение — Pearl & Paper',description:'Одно особенное письмо. Один незабываемый день. Приглашаем вас стать частью нашей истории.' }
};

export const names = () => `${wedding.groom || 'Имя жениха'} & ${wedding.bride || 'Имя невесты'}`;
export const monogram = () => wedding.initials || (wedding.groom && wedding.bride ? `${wedding.groom[0]} & ${wedding.bride[0]}` : 'Ж & Н');



