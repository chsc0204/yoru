// ===== 앨범 데모 데이터 (20개, 아티스트당 1개) =====
// trackIds는 SONGS에 실제로 존재하는 곡만 연결해, Track List를 클릭하면
// 항상 정상적으로 Song Detail로 이동합니다.
const ALBUMS = [
  { id: 'yoasobi-thebook', title: 'THE BOOK', artistId: 'yoasobi', releaseYear: 2021, genre: 'J-Pop', description: 'YOASOBI의 대표곡들을 모은 첫 정규 앨범 성격의 컴필레이션.', trackIds: ['yoasobi-yorunikakeru', 'yoasobi-idol'] },
  { id: 'ado-zanmu', title: 'Zanmu (残夢)', artistId: 'ado', releaseYear: 2022, genre: 'J-Pop', description: 'Ado의 폭발적인 가창력을 압축해서 보여주는 정규 앨범.', trackIds: ['ado-usseewa', 'ado-shou'] },
  { id: 'kenshi-straysheep', title: 'STRAY SHEEP', artistId: 'kenshi-yonezu', releaseYear: 2020, genre: 'J-Pop', description: '기존 싱글과 신곡을 아우르는 Kenshi Yonezu의 정규 앨범.', trackIds: ['kenshi-lemon', 'kenshi-kickback'] },
  { id: 'fujii-helpeverhurtnever', title: 'HELP EVER HURT NEVER', artistId: 'fujii-kaze', releaseYear: 2020, genre: 'Soul', description: 'Fujii Kaze의 데뷔 정규 앨범.', trackIds: ['fujii-nannan', 'fujii-hana'] },
  { id: 'higedan-traveler', title: 'Traveler', artistId: 'official-higedandism', releaseYear: 2019, genre: 'Rock', description: 'Official HIGE DANdism의 이름을 널리 알린 정규 앨범.', trackIds: ['higedan-pretender', 'higedan-subtitle'] },
  { id: 'mga-antenna', title: 'ANTENNA', artistId: 'mrs-green-apple', releaseYear: 2022, genre: 'Rock', description: 'Mrs. GREEN APPLE의 대표곡을 담은 정규 앨범.', trackIds: ['mga-dancehall', 'mga-queserasera'] },
  { id: 'kinggnu-ceremony', title: 'CEREMONY', artistId: 'king-gnu', releaseYear: 2020, genre: 'Alternative', description: 'King Gnu의 이름을 대중적으로 알린 정규 앨범.', trackIds: ['kinggnu-hakujitsu', 'kinggnu-flash'] },
  { id: 'vaundy-strobo', title: 'strobo', artistId: 'vaundy', releaseYear: 2021, genre: 'Alternative', description: 'Vaundy의 다채로운 스타일을 보여주는 정규 앨범.', trackIds: ['vaundy-kaijuu', 'vaundy-tokyoflash'] },
  { id: 'backnumber-encore', title: 'アンコール', artistId: 'back-number', releaseYear: 2013, genre: 'Ballad', description: 'back number의 초기 대표곡을 모은 앨범.', trackIds: ['backnumber-christmassong', 'backnumber-takanenohanako'] },
  { id: 'aimyon-shunkantekisixsense', title: '瞬間的シックスセンス', artistId: 'aimyon', releaseYear: 2018, genre: 'Ballad', description: 'Aimyon의 이름을 널리 알린 정규 앨범.', trackIds: ['aimyon-marigold', 'aimyon-aiwotsutaetai'] },
  { id: 'lisa-leonine', title: 'LEO-NiNE', artistId: 'lisa', releaseYear: 2021, genre: 'Anime Song', description: 'LiSA의 대표 애니메이션 주제곡들을 담은 정규 앨범.', trackIds: ['lisa-gurenge', 'lisa-homura'] },
  { id: 'eve-smile', title: 'Smile', artistId: 'eve', releaseYear: 2021, genre: 'Alternative', description: 'Eve의 독자적인 세계관을 담은 정규 앨범.', trackIds: ['eve-kaikaikitan', 'eve-kumonoito'] },
  { id: 'yorushika-makeinu', title: '負け犬にアンコールはいらない', artistId: 'yorushika', releaseYear: 2021, genre: 'Rock', description: 'Yorushika의 서정적인 세계관이 담긴 정규 앨범.', trackIds: ['yorushika-dakarabokuha', 'yorushika-hananibourei'] },
  { id: 'radwimps-ningenkaika', title: '人間開花', artistId: 'radwimps', releaseYear: 2016, genre: 'Rock', description: 'RADWIMPS의 대표곡이 다수 수록된 정규 앨범.', trackIds: ['radwimps-zenzenzense', 'radwimps-sparkle'] },
  { id: 'sekaowa-tree', title: 'Tree', artistId: 'sekai-no-owari', releaseYear: 2013, genre: 'J-Pop', description: 'SEKAI NO OWARI의 초기 대표곡을 담은 정규 앨범.', trackIds: ['sekaowa-rpg', 'sekaowa-honootomori'] },
  { id: 'zutomayo-ananonym', title: 'An Anonym', artistId: 'zutomayo', releaseYear: 2020, genre: 'Alternative', description: 'ZUTOMAYO의 실험적인 사운드를 담은 정규 앨범.', trackIds: ['zutomayo-byoushin', 'zutomayo-aitsurazenin'] },
  { id: 'perfume-game', title: 'GAME', artistId: 'perfume', releaseYear: 2008, genre: 'Electropop', description: 'Perfume의 이름을 널리 알린 정규 앨범.', trackIds: ['perfume-polyrhythm', 'perfume-chocolatedisco'] },
  { id: 'babymetal-metalresistance', title: 'METAL RESISTANCE', artistId: 'babymetal', releaseYear: 2016, genre: 'Metal', description: 'BABYMETAL의 세계관을 확장시킨 두 번째 정규 앨범.', trackIds: ['babymetal-gimmechocolate', 'babymetal-headbanger'] },
  { id: 'aimer-sundance', title: 'Sun Dance', artistId: 'aimer', releaseYear: 2017, genre: 'Ballad', description: 'Aimer의 허스키한 보컬이 돋보이는 정규 앨범.', trackIds: ['aimer-kataomoi', 'aimer-refrain'] },
  { id: 'milet-eyes', title: 'eyes', artistId: 'milet', releaseYear: 2021, genre: 'Anime Song', description: 'milet의 대표 애니메이션 주제곡을 담은 정규 앨범.', trackIds: ['milet-insideyou', 'milet-flyhigh'] },
];
