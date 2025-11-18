// API base URLs
const API_BASE_URL = 'https://api.pgr2stats.com/api';
const API2_BASE_URL = 'https://api2.pgr2stats.com/api2';

// Leaderboard names mapping
const leaderboardNames = {
    "#001": "Xbox Live - Accumulated Kudos",
    "#002": "Xbox Live - Edinburgh - All Tracks Sum Of Best Kudos",
    "#003": "Xbox Live - Moscow - All Tracks Sum Of Best Kudos",
    "#004": "Xbox Live - Barcelona - All Tracks Sum Of Best Kudos",
    "#005": "Xbox Live - Washington DC - All Tracks Sum Of Best Kudos",
    "#006": "Xbox Live - Chicago - All Tracks Sum Of Best Kudos",
    "#007": "Xbox Live - Florence - All Tracks Sum Of Best Kudos",
    "#008": "Xbox Live - Nurburgring - Sum Of Best Kudos",
    "#009": "Xbox Live - Stockholm - All Tracks Sum Of Best Kudos",
    "#010": "Xbox Live - Hong Kong - All Tracks Sum Of Best Kudos",
    "#011": "Xbox Live - Yokohama - All Tracks Sum Of Best Kudos",
    "#012": "Xbox Live - Sydney - All Tracks Sum Of Best Kudos",
    "#013": "Xbox Live - Long Beach - All Tracks Sum Of Best Kudos",
    "#014": "Xbox Live - Paris - All Tracks Sum Of Best Kudos",
    "#015": "Geometry Wars High Score",
    "#016": "All Time Ghost Challenge - Stockholm Style",
    "#017": "All Time Ghost Challenge - Chicago Style",
    "#022": "Weekly Hot Lap Series",
    "#023": "Weekly Hot Lap Series",
    "#024": "Weekly Hot Lap Series",
    "#025": "Weekly Cone Challenge Series",
    "#026": "Weekly Cone Challenge Series",
    "#027": "Weekly Cone Challenge Series",
    "#028": "Weekly Cone Challenge Series",
    "#029": "Monthly Hot Lap",
    "#030": "Monthly Hot Lap",
    "#031": "Monthly Hot Lap",
    "#032": "Monthly Hot Lap",
    "#033": "Monthly Cone Challenge",
    "#034": "Monthly Cone Challenge",
    "#035": "Monthly Cone Challenge",
    "#036": "Monthly Cone Challenge",
    "#037": "All Time Ghost Challenge - Nurburgring Speed",
    "#038": "Kudos World Series - Compact Sport Series - Event 1 (Street Race)",
    "#039": "Kudos World Series - Compact Sport Series - Event 2 (One on One)",
    "#040": "Kudos World Series - Compact Sport Series - Event 3 (Cone Challenge)",
    "#041": "Kudos World Series - Compact Sport Series - Event 4 (One on One)",
    "#042": "Kudos World Series - Compact Sport Series - Event 5 (Street Race)",
    "#043": "Kudos World Series - Compact Sport Series - Event 6 (Speed Camera)",
    "#044": "Kudos World Series - Compact Sport Series - Event 7 (Street Race)",
    "#045": "Kudos World Series - Sports Convertible Series - Event 1 (Overtake)",
    "#046": "Kudos World Series - Sports Convertible Series - Event 2 (Street Race)",
    "#047": "Kudos World Series - Sports Convertible Series - Event 3 (Street Race)",
    "#048": "Kudos World Series - Sports Convertible Series - Event 4 (One on One)",
    "#049": "Kudos World Series - Sports Convertible Series - Event 5 (Cone Challenge)",
    "#050": "Kudos World Series - Sports Convertible Series - Event 6 (Speed Camera)",
    "#051": "Kudos World Series - Sports Convertible Series - Event 7 (Street Race)",
    "#052": "Kudos World Series - Coupe Series - Event 1 (Timed Run)",
    "#053": "Kudos World Series - Coupe Series - Event 2 (Street Race)",
    "#054": "Kudos World Series - Coupe Series - Event 3 (Speed Camera)",
    "#055": "Kudos World Series - Coupe Series - Event 4 (One on One)",
    "#056": "Kudos World Series - Coupe Series - Event 5 (Cone Challenge)",
    "#057": "Kudos World Series - Coupe Series - Event 6 (Overtake)",
    "#058": "Kudos World Series - Coupe Series - Event 7 (Hot Lap)",
    "#059": "Kudos World Series - Coupe Series - Event 8 (Street Race)",
    "#060": "Kudos World Series - Sport Utility Series - Event 1 (Hot Lap)",
    "#061": "Kudos World Series - Sport Utility Series - Event 2 (Speed Camera)",
    "#062": "Kudos World Series - Sport Utility Series - Event 3 (Street Race)",
    "#063": "Kudos World Series - Sport Utility Series - Event 4 (One on One)",
    "#064": "Kudos World Series - Sport Utility Series - Event 5 (Cone Challenge)",
    "#065": "Kudos World Series - Sport Utility Series - Event 6 (Overtake)",
    "#066": "Kudos World Series - Sport Utility Series - Event 7 (Street Race)",
    "#067": "Kudos World Series - Sport Utility Series - Event 8 (Street Race)",
    "#068": "Kudos World Series - Pacific Muscle Series - Event 1 (Street Race)",
    "#069": "Kudos World Series - Pacific Muscle Series - Event 2 (Street Race)",
    "#070": "Kudos World Series - Pacific Muscle Series - Event 3 (Street Race)",
    "#071": "Kudos World Series - Pacific Muscle Series - Event 4 (Cone Challenge)",
    "#072": "Kudos World Series - Pacific Muscle Series - Event 5 (Hot Lap)",
    "#073": "Kudos World Series - Pacific Muscle Series - Event 6 (One on One)",
    "#074": "Kudos World Series - Pacific Muscle Series - Event 7 (Street Race)",
    "#075": "Kudos World Series - Pacific Muscle Series - Event 8 (Street Race)",
    "#076": "Kudos World Series - Pacific Muscle Series - Event 9 (Speed Camera)",
    "#077": "Kudos World Series - Pacific Muscle Series - Event 10 (Street Race)",
    "#078": "Kudos World Series - Roadster Series - Event 1 (Timed Run)",
    "#079": "Kudos World Series - Roadster Series - Event 2 (Cone Challenge)",
    "#080": "Kudos World Series - Roadster Series - Event 3 (Street Race)",
    "#081": "Kudos World Series - Roadster Series - Event 4 (Timed Run)",
    "#082": "Kudos World Series - Roadster Series - Event 5 (Overtake)",
    "#083": "Kudos World Series - Roadster Series - Event 6 (Timed Run)",
    "#084": "Kudos World Series - Roadster Series - Event 7 (Cone Challenge)",
    "#085": "Kudos World Series - Roadster Series - Event 8 (One on One)",
    "#086": "Kudos World Series - Roadster Series - Event 9 (Street Race)",
    "#087": "Kudos World Series - Roadster Series - Event 10 (Speed Camera)",
    "#088": "Kudos World Series - Roadster Series - Event 11 (Street Race)",
    "#089": "Kudos World Series - Classics Series - Event 1 (Hot Lap)",
    "#090": "Kudos World Series - Classics Series - Event 2 (Timed Run)",
    "#091": "Kudos World Series - Classics Series - Event 3 (Street Race)",
    "#092": "Kudos World Series - Classics Series - Event 4 (One on One)",
    "#093": "Kudos World Series - Classics Series - Event 5 (Hot Lap)",
    "#094": "Kudos World Series - Classics Series - Event 6 (Cone Challenge)",
    "#095": "Kudos World Series - Classics Series - Event 7 (Overtake)",
    "#096": "Kudos World Series - Classics Series - Event 8 (One on One)",
    "#097": "Kudos World Series - Classics Series - Event 9 (Hot Lap)",
    "#098": "Kudos World Series - Classics Series - Event 10 (Speed Camera)",
    "#099": "Kudos World Series - Classics Series - Event 11 (Street Race)",
    "#100": "Kudos World Series - Sports Coupe Series - Event 1 (Timed Run)",
    "#101": "Kudos World Series - Sports Coupe Series - Event 2 (Overtake)",
    "#102": "Kudos World Series - Sports Coupe Series - Event 3 (Street Race)",
    "#103": "Kudos World Series - Sports Coupe Series - Event 4 (One on One)",
    "#104": "Kudos World Series - Sports Coupe Series - Event 5 (Overtake)",
    "#105": "Kudos World Series - Sports Coupe Series - Event 6 (Street Race)",
    "#106": "Kudos World Series - Sports Coupe Series - Event 7 (Cone Challenge)",
    "#107": "Kudos World Series - Sports Coupe Series - Event 8 (Speed Camera)",
    "#108": "Kudos World Series - Sports Coupe Series - Event 9 (One on One)",
    "#109": "Kudos World Series - Sports Coupe Series - Event 10 (Timed Run)",
    "#110": "Kudos World Series - Sports Coupe Series - Event 11 (Street Race)",
    "#111": "Kudos World Series - Sports Coupe Series - Event 12 (Street Race)",
    "#112": "Kudos World Series - Sports Coupe Series - Event 13 (Street Race)",
    "#113": "Kudos World Series - American Muscle Series - Event 1 (Street Race)",
    "#114": "Kudos World Series - American Muscle Series - Event 2 (Street Race)",
    "#115": "Kudos World Series - American Muscle Series - Event 3 (Cone Challenge)",
    "#116": "Kudos World Series - American Muscle Series - Event 4 (Hot Lap)",
    "#117": "Kudos World Series - American Muscle Series - Event 5 (One on One)",
    "#118": "Kudos World Series - American Muscle Series - Event 6 (Street Race)",
    "#119": "Kudos World Series - American Muscle Series - Event 7 (Cone Challenge)",
    "#120": "Kudos World Series - American Muscle Series - Event 8 (Street Race)",
    "#121": "Kudos World Series - American Muscle Series - Event 9 (Hot Lap)",
    "#122": "Kudos World Series - American Muscle Series - Event 10 (Timed Run)",
    "#123": "Kudos World Series - American Muscle Series - Event 11 (Street Race)",
    "#124": "Kudos World Series - American Muscle Series - Event 12 (Street Race)",
    "#125": "Kudos World Series - American Muscle Series - Event 13 (Speed Camera)",
    "#126": "Kudos World Series - American Muscle Series - Event 14 (Street Race)",
    "#127": "Kudos World Series - Super Car Series - Event 1 (Timed Run)",
    "#128": "Kudos World Series - Super Car Series - Event 2 (Overtake)",
    "#129": "Kudos World Series - Super Car Series - Event 3 (One on One)",
    "#130": "Kudos World Series - Super Car Series - Event 4 (Speed Camera)",
    "#131": "Kudos World Series - Super Car Series - Event 5 (Street Race)",
    "#132": "Kudos World Series - Super Car Series - Event 6 (Hot Lap)",
    "#133": "Kudos World Series - Super Car Series - Event 7 (Hot Lap)",
    "#134": "Kudos World Series - Super Car Series - Event 8 (Street Race)",
    "#135": "Kudos World Series - Super Car Series - Event 9 (One on One)",
    "#136": "Kudos World Series - Super Car Series - Event 10 (Hot Lap)",
    "#137": "Kudos World Series - Super Car Series - Event 11 (Overtake)",
    "#138": "Kudos World Series - Super Car Series - Event 12 (Street Race)",
    "#139": "Kudos World Series - Super Car Series - Event 13 (Street Race)",
    "#140": "Kudos World Series - Super Car Series - Event 14 (Street Race)",
    "#141": "Kudos World Series - Grand Touring Series - Event 1 (Timed Run)",
    "#142": "Kudos World Series - Grand Touring Series - Event 2 (Overtake)",
    "#143": "Kudos World Series - Grand Touring Series - Event 3 (Street Race)",
    "#144": "Kudos World Series - Grand Touring Series - Event 4 (One on One)",
    "#145": "Kudos World Series - Grand Touring Series - Event 5 (Cone Challenge)",
    "#146": "Kudos World Series - Grand Touring Series - Event 6 (Street Race)",
    "#147": "Kudos World Series - Grand Touring Series - Event 7 (Overtake)",
    "#148": "Kudos World Series - Grand Touring Series - Event 8 (Hot Lap)",
    "#149": "Kudos World Series - Grand Touring Series - Event 9 (Street Race)",
    "#150": "Kudos World Series - Grand Touring Series - Event 10 (One on One)",
    "#151": "Kudos World Series - Grand Touring Series - Event 11 (Overtake)",
    "#152": "Kudos World Series - Grand Touring Series - Event 12 (Hot Lap)",
    "#153": "Kudos World Series - Grand Touring Series - Event 13 (One on One)",
    "#154": "Kudos World Series - Grand Touring Series - Event 14 (Speed Camera)",
    "#155": "Kudos World Series - Grand Touring Series - Event 15 (Street Race)",
    "#156": "Kudos World Series - Grand Touring Series - Event 16 (Street Race)",
    "#157": "Kudos World Series - Track Specials Series - Event 1 (Hot Lap)",
    "#158": "Kudos World Series - Track Specials Series - Event 2 (Street Race)",
    "#159": "Kudos World Series - Track Specials Series - Event 3 (Hot Lap)",
    "#160": "Kudos World Series - Track Specials Series - Event 4 (Hot Lap)",
    "#161": "Kudos World Series - Track Specials Series - Event 5 (One on One)",
    "#162": "Kudos World Series - Track Specials Series - Event 6 (Street Race)",
    "#163": "Kudos World Series - Track Specials Series - Event 7 (Overtake)",
    "#164": "Kudos World Series - Track Specials Series - Event 8 (Timed Run)",
    "#165": "Kudos World Series - Track Specials Series - Event 9 (Hot Lap)",
    "#166": "Kudos World Series - Track Specials Series - Event 10 (One on One)",
    "#167": "Kudos World Series - Track Specials Series - Event 11 (Overtake)",
    "#168": "Kudos World Series - Track Specials Series - Event 12 (Timed Run)",
    "#169": "Kudos World Series - Track Specials Series - Event 13 (Hot Lap)",
    "#170": "Kudos World Series - Track Specials Series - Event 14 (Street Race)",
    "#171": "Kudos World Series - Track Specials Series - Event 15 (One on One)",
    "#172": "Kudos World Series - Track Specials Series - Event 16 (Speed Camera)",
    "#173": "Kudos World Series - Track Specials Series - Event 17 (Street Race)",
    "#174": "Kudos World Series - Extreme Series - Event 1 (Timed Run)",
    "#175": "Kudos World Series - Extreme Series - Event 2 (Overtake)",
    "#176": "Kudos World Series - Extreme Series - Event 3 (Street Race)",
    "#177": "Kudos World Series - Extreme Series - Event 4 (One on One)",
    "#178": "Kudos World Series - Extreme Series - Event 5 (One on One)",
    "#179": "Kudos World Series - Extreme Series - Event 6 (One on One)",
    "#180": "Kudos World Series - Extreme Series - Event 7 (Timed Run)",
    "#181": "Kudos World Series - Extreme Series - Event 8 (Cone Challenge)",
    "#182": "Kudos World Series - Extreme Series - Event 9 (Hot Lap)",
    "#183": "Kudos World Series - Extreme Series - Event 10 (Street Race)",
    "#184": "Kudos World Series - Extreme Series - Event 11 (Street Race)",
    "#185": "Kudos World Series - Extreme Series - Event 12 (Street Race)",
    "#186": "Kudos World Series - Extreme Series - Event 13 (Speed Camera)",
    "#187": "Kudos World Series - Extreme Series - Event 14 (One on One)",
    "#188": "Kudos World Series - Extreme Series - Event 15 (Street Race)",
    "#189": "Kudos World Series - Extreme Series - Event 16 (Street Race)",
    "#190": "Kudos World Series - Extreme Series - Event 17 (Street Race)",
    "#191": "Kudos World Series - Ultimate Series - Event 1 (Street Race)",
    "#192": "Kudos World Series - Ultimate Series - Event 2 (Street Race)",
    "#193": "Kudos World Series - Ultimate Series - Event 3 (Street Race)",
    "#194": "Kudos World Series - Ultimate Series - Event 4 (Street Race)",
    "#195": "Kudos World Series - Ultimate Series - Event 5 (Cone Challenge)",
    "#196": "Kudos World Series - Ultimate Series - Event 6 (Street Race)",
    "#197": "Kudos World Series - Ultimate Series - Event 7 (Cone Challenge)",
    "#198": "Kudos World Series - Ultimate Series - Event 8 (Street Race)",
    "#199": "Kudos World Series - Ultimate Series - Event 9 (Street Race)",
    "#200": "Kudos World Series - Ultimate Series - Event 10 (Street Race)",
    "#201": "Kudos World Series - Ultimate Series - Event 11 (Street Race)",
    "#202": "Kudos World Series - Ultimate Series - Event 12 (Cone Challenge)",
    "#203": "Kudos World Series - Ultimate Series - Event 13 (Street Race)",
    "#204": "Kudos World Series - Ultimate Series - Event 14 (Cone Challenge)",
    "#205": "Kudos World Series - Ultimate Series - Event 15 (Street Race)",
    "#206": "Kudos World Series - Ultimate Series - Event 16 (Speed Camera)",
    "#207": "Kudos World Series - Ultimate Series - Event 17 (Street Race)",
    "#208": "Kudos World Series - Ultimate Series - Event 18 (Street Race)",
    "#209": "Kudos World Series - Ultimate Series - Event 19 (Street Race)",
    "#210": "Arcade Racing - Street Race 1",
    "#211": "Arcade Racing - Street Race 2",
    "#212": "Arcade Racing - Street Race 3",
    "#213": "Arcade Racing - Street Race 4",
    "#214": "Arcade Racing - Street Race 5",
    "#215": "Arcade Racing - Street Race 6",
    "#216": "Arcade Racing - Street Race 7",
    "#217": "Arcade Racing - Street Race 8",
    "#218": "Arcade Racing - Street Race 9",
    "#219": "Arcade Racing - Street Race 10",
    "#220": "Arcade Racing - Street Race 11",
    "#221": "Arcade Racing - Street Race 12",
    "#222": "Arcade Racing - Street Race 13",
    "#223": "Arcade Racing - Street Race 14",
    "#224": "Arcade Racing - Street Race 15",
    "#225": "Arcade Racing - Street Race 16",
    "#226": "Arcade Racing - Street Race 17",
    "#227": "Arcade Racing - Street Race 18",
    "#228": "Arcade Racing - Street Race 19",
    "#229": "Arcade Racing - Street Race 20",
    "#230": "Arcade Racing - Timed Run 1",
    "#231": "Arcade Racing - Timed Run 2",
    "#232": "Arcade Racing - Timed Run 3",
    "#233": "Arcade Racing - Timed Run 4",
    "#234": "Arcade Racing - Timed Run 5",
    "#235": "Arcade Racing - Timed Run 6",
    "#236": "Arcade Racing - Timed Run 7",
    "#237": "Arcade Racing - Timed Run 8",
    "#238": "Arcade Racing - Timed Run 9",
    "#239": "Arcade Racing - Timed Run 10",
    "#240": "Arcade Racing - Timed Run 11",
    "#241": "Arcade Racing - Timed Run 12",
    "#242": "Arcade Racing - Timed Run 13",
    "#243": "Arcade Racing - Timed Run 14",
    "#244": "Arcade Racing - Timed Run 15",
    "#245": "Arcade Racing - Timed Run 16",
    "#246": "Arcade Racing - Timed Run 17",
    "#247": "Arcade Racing - Timed Run 18",
    "#248": "Arcade Racing - Timed Run 19",
    "#249": "Arcade Racing - Timed Run 20",
    "#250": "Arcade Racing - Cone Challenge 1",
    "#251": "Arcade Racing - Cone Challenge 2",
    "#252": "Arcade Racing - Cone Challenge 3",
    "#253": "Arcade Racing - Cone Challenge 4",
    "#254": "Arcade Racing - Cone Challenge 5",
    "#255": "Arcade Racing - Cone Challenge 6",
    "#256": "Arcade Racing - Cone Challenge 7",
    "#257": "Arcade Racing - Cone Challenge 8",
    "#258": "Arcade Racing - Cone Challenge 9",
    "#259": "Arcade Racing - Cone Challenge 10",
    "#260": "Arcade Racing - Cone Challenge 11",
    "#261": "Arcade Racing - Cone Challenge 12",
    "#262": "Arcade Racing - Cone Challenge 13",
    "#263": "Arcade Racing - Cone Challenge 14",
    "#264": "Arcade Racing - Cone Challenge 15",
    "#265": "Arcade Racing - Cone Challenge 16",
    "#266": "Arcade Racing - Cone Challenge 17",
    "#267": "Arcade Racing - Cone Challenge 18",
    "#268": "Arcade Racing - Cone Challenge 19",
    "#269": "Arcade Racing - Cone Challenge 20",
    "#271": "Time Attack - Circuit Challenge - Washington D.C. - Capitol Thrill",
    "#272": "Time Attack - Circuit Challenge - Washington D.C. - Up and Over",
    "#273": "Time Attack - Circuit Challenge - Washington D.C. - Capitol Thrill 2",
    "#274": "Time Attack - Circuit Challenge - Washington D.C. - Square Dancin'",
    "#275": "Time Attack - Circuit Challenge - Washington D.C. - Ring Race",
    "#276": "Time Attack - Circuit Challenge - Washington D.C. - The Tour",
    "#277": "Time Attack - Circuit Challenge - Washington D.C. - Northside Slide",
    "#278": "Time Attack - Circuit Challenge - Chicago - Chicago River Tour",
    "#279": "Time Attack - Circuit Challenge - Chicago - The Miracle Mile",
    "#280": "Time Attack - Circuit Challenge - Chicago - North Wasbash Overpass",
    "#281": "Time Attack - Circuit Challenge - Chicago - River Crossing",
    "#282": "Time Attack - Circuit Challenge - Chicago - In The Loop",
    "#283": "Time Attack - Circuit Challenge - Chicago - Lower Wacker Run",
    "#284": "Time Attack - Circuit Challenge - Chicago - East Kinzie Crossover",
    "#285": "Time Attack - Circuit Challenge - Chicago - Wells & Lake",
    "#286": "Time Attack - Circuit Challenge - Chicago - East On Wacker",
    "#287": "Time Attack - Circuit Challenge - Chicago - West On Wacker",
    "#288": "Time Attack - Circuit Challenge - Edinburgh - Princes Street East",
    "#289": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket East",
    "#290": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket West",
    "#291": "Time Attack - Circuit Challenge - Edinburgh - Lothian Road Eight",
    "#292": "Time Attack - Circuit Challenge - Edinburgh - Lothian Road Eight Long",
    "#293": "Time Attack - Circuit Challenge - Edinburgh - Princes Street Loop",
    "#294": "Time Attack - Circuit Challenge - Edinburgh - Grassmarket Eight",
    "#295": "Time Attack - Circuit Challenge - Edinburgh - Princes Street Long",
    "#296": "Time Attack - Circuit Challenge - Edinburgh - Castle Eight",
    "#297": "Time Attack - Circuit Challenge - Edinburgh - Terrace Sprint",
    "#298": "Time Attack - Circuit Challenge - Florence - Piazza della Signoria 1",
    "#299": "Time Attack - Circuit Challenge - Florence - Ponte Vecchio",
    "#300": "Time Attack - Circuit Challenge - Florence - Piazza della Signoria 2",
    "#301": "Time Attack - Circuit Challenge - Florence - Duomo 1",
    "#302": "Time Attack - Circuit Challenge - Florence - Piazza della Repubblica",
    "#303": "Time Attack - Circuit Challenge - Florence - Arno",
    "#304": "Time Attack - Circuit Challenge - Florence - Arno 2",
    "#305": "Time Attack - Circuit Challenge - Florence - Uffizi",
    "#306": "Time Attack - Circuit Challenge - Florence - Battistero 1",
    "#307": "Time Attack - Circuit Challenge - Florence - Battistero 2",
    "#308": "Time Attack - Circuit Challenge - Florence - Duomo 2",
    "#309": "Time Attack - Circuit Challenge - Nurburgring - Nordschleife 1",
    "#310": "Time Attack - Circuit Challenge - Stockholm - Speed Freak",
    "#311": "Time Attack - Circuit Challenge - Stockholm - Island Hop",
    "#312": "Time Attack - Circuit Challenge - Stockholm - Gamla Stan Loop",
    "#313": "Time Attack - Circuit Challenge - Stockholm - Northern",
    "#314": "Time Attack - Circuit Challenge - Stockholm - Bridges",
    "#315": "Time Attack - Circuit Challenge - Stockholm - Gamla Island Hopping",
    "#316": "Time Attack - Circuit Challenge - Stockholm - Round the Riksdagshuset",
    "#317": "Time Attack - Circuit Challenge - Stockholm - Northern 2",
    "#318": "Time Attack - Circuit Challenge - Stockholm - Gamla Oval",
    "#319": "Time Attack - Circuit Challenge - Stockholm - Northern 3",
    "#320": "Time Attack - Circuit Challenge - Barcelona - Place de Jaume",
    "#321": "Time Attack - Circuit Challenge - Barcelona - Passeig de Colom",
    "#322": "Time Attack - Circuit Challenge - Barcelona - Barri Gotic",
    "#323": "Time Attack - Circuit Challenge - Barcelona - Catedral",
    "#324": "Time Attack - Circuit Challenge - Barcelona - Las Ramblas",
    "#325": "Time Attack - Circuit Challenge - Barcelona - Catalan Challenge",
    "#326": "Time Attack - Circuit Challenge - Moscow - KGB Corner",
    "#327": "Time Attack - Circuit Challenge - Moscow - St Basil's Circle",
    "#328": "Time Attack - Circuit Challenge - Moscow - Kremlin 1",
    "#329": "Time Attack - Circuit Challenge - Moscow - Lenin",
    "#330": "Time Attack - Circuit Challenge - Moscow - Kremlin 2",
    "#331": "Time Attack - Circuit Challenge - Moscow - Red Square 1",
    "#332": "Time Attack - Circuit Challenge - Moscow - Red Square 2",
    "#333": "Time Attack - Circuit Challenge - Hong Kong - Admiralty",
    "#334": "Time Attack - Circuit Challenge - Hong Kong - The Waterfront",
    "#335": "Time Attack - Circuit Challenge - Hong Kong - Wan Chai Run",
    "#336": "Time Attack - Circuit Challenge - Hong Kong - Cotton Tree Drive",
    "#337": "Time Attack - Circuit Challenge - Hong Kong - Harbour Run",
    "#338": "Time Attack - Circuit Challenge - Hong Kong - The Convention Centres",
    "#339": "Time Attack - Circuit Challenge - Hong Kong - Hennessey Road",
    "#340": "Time Attack - Circuit Challenge - Hong Kong - Harcourt Challenge",
    "#341": "Time Attack - Circuit Challenge - Yokohama - Yokohama Bay Tour",
    "#342": "Time Attack - Circuit Challenge - Yokohama - Yokohama Challenge",
    "#343": "Time Attack - Circuit Challenge - Yokohama - Kishamichi",
    "#344": "Time Attack - Circuit Challenge - Yokohama - Downtown",
    "#345": "Time Attack - Circuit Challenge - Yokohama - Warehouse Loop",
    "#346": "Time Attack - Circuit Challenge - Yokohama - Seaside Loop",
    "#347": "Time Attack - Circuit Challenge - Yokohama - Honcho dori",
    "#348": "Time Attack - Circuit Challenge - Yokohama - Sakuragicho",
    "#349": "Time Attack - Circuit Challenge - Yokohama - Minato Mirai",
    "#350": "Time Attack - Circuit Challenge - Yokohama - Shinko Park",
    "#351": "Time Attack - Circuit Challenge - Sydney - Argyle Street",
    "#352": "Time Attack - Circuit Challenge - Sydney - Opera House View",
    "#353": "Time Attack - Circuit Challenge - Sydney - Harbour Bridge",
    "#354": "Time Attack - Circuit Challenge - Sydney - Dawes Point Loop",
    "#355": "Time Attack - Circuit Challenge - Sydney - The Wharf",
    "#356": "Time Attack - Circuit Challenge - Sydney - Cumberland Street",
    "#357": "Time Attack - Circuit Challenge - Sydney - Hickson Run",
    "#358": "Time Attack - Circuit Challenge - Sydney - Sydney Harbour",
    "#359": "Time Attack - Circuit Challenge - Sydney - The Rocks Route",
    "#360": "Time Attack - Circuit Challenge - Sydney - George St Challenge",
    "#361": "Time Attack - Circuit Challenge - Sydney - Under the Bridge",
    "#362": "Time Attack - Circuit Challenge - Sydney - Downtown Short",
    "#363": "Time Attack - Car Challenge - Compact Sports - Mini Cooper S",
    "#364": "Time Attack - Car Challenge - Compact Sports - Seat Leon Cupra R",
    "#365": "Time Attack - Car Challenge - Compact Sports - Ford Focus RS",
    "#366": "Time Attack - Car Challenge - Compact Sports - Honda Civic Type-R (J)",
    "#367": "Time Attack - Car Challenge - Compact Sports - Renault Clio V6",
    "#368": "Time Attack - Car Challenge - Compact Sports - VW R32",
    "#369": "Time Attack - Car Challenge - Compact Sports - VW New Beetle RSI",
    "#370": "Time Attack - Car Challenge - Compact Sports - Lancia Delta Integrale Evo",
    "#371": "Time Attack - Car Challenge - Sports Convertible - Toyota MR2 Spyder",
    "#372": "Time Attack - Car Challenge - Sports Convertible - Mazda Miata MX-5",
    "#373": "Time Attack - Car Challenge - Sports Convertible - Porsche Boxster S",
    "#374": "Time Attack - Car Challenge - Sports Convertible - Honda S2000",
    "#375": "Time Attack - Car Challenge - Sports Convertible - BMW Z4 3.0i",
    "#376": "Time Attack - Car Challenge - Sports Convertible - Audi TT Roadster",
    "#377": "Time Attack - Car Challenge - Coupe - Audi TT Coupe",
    "#378": "Time Attack - Car Challenge - Coupe - Honda Integra Type-R (J)",
    "#379": "Time Attack - Car Challenge - Coupe - Mazda RX-8",
    "#380": "Time Attack - Car Challenge - Coupe - Nissan 350Z",
    "#381": "Time Attack - Car Challenge - Coupe - Audi S4",
    "#382": "Time Attack - Car Challenge - Coupe - BMW M3",
    "#383": "Time Attack - Car Challenge - Coupe - Audi TT 3.2 Quattro",
    "#384": "Time Attack - Car Challenge - Sport Utility - Volvo XC90",
    "#385": "Time Attack - Car Challenge - Sport Utility - Mercedes ML55 AMG",
    "#386": "Time Attack - Car Challenge - Sport Utility - Porsche Cayenne Turbo",
    "#387": "Time Attack - Car Challenge - Sport Utility - Chevrolet SSR",
    "#388": "Time Attack - Car Challenge - Sport Utility - BMW X5 4.6is",
    "#389": "Time Attack - Car Challenge - Sport Utility - Ford SVT Lightning",
    "#390": "Time Attack - Car Challenge - Sports Coupe - Audi RS6",
    "#391": "Time Attack - Car Challenge - Grand Touring - Bentley Continental GT",
    "#392": "Time Attack - Car Challenge - Pacific Muscle - Mazda RX-7",
    "#393": "Time Attack - Car Challenge - Pacific Muscle - Toyota Supra Twin-Turbo",
    "#394": "Time Attack - Car Challenge - Pacific Muscle - Mitsubishi 3000 GT VR4",
    "#395": "Time Attack - Car Challenge - Pacific Muscle - Mitsubishi Lancer Evolution VII",
    "#396": "Time Attack - Car Challenge - Pacific Muscle - Subaru Impreza WRX STi",
    "#397": "Time Attack - Car Challenge - Pacific Muscle - Nissan Skyline GT-R (R34) Nur",
    "#398": "Time Attack - Car Challenge - Roadster - Vauxhall VX220",
    "#399": "Time Attack - Car Challenge - Roadster - Lotus Elise",
    "#400": "Time Attack - Car Challenge - Sports Coupe - TVR Tamora",
    "#401": "Time Attack - Car Challenge - Roadster - Lotus 340R",
    "#402": "Time Attack - Car Challenge - Roadster - Caterham 7 Classic",
    "#403": "Time Attack - Car Challenge - Roadster - Renault Spider",
    "#404": "Time Attack - Car Challenge - Classics - Porsche 550 Spyder",
    "#405": "Time Attack - Car Challenge - Classics - Jaguar E-Type",
    "#406": "Time Attack - Car Challenge - Classics - Nissan 240Z",
    "#407": "Time Attack - Car Challenge - Classics - Mercedes 300SL Gullwing",
    "#408": "Time Attack - Car Challenge - Classics - Porsche 911 RS 2.7",
    "#409": "Time Attack - Car Challenge - Classics - Ferrari 275 GTB",
    "#410": "Time Attack - Car Challenge - Roadster - AC 427 MKIII",
    "#411": "Time Attack - Car Challenge - Classics - Ferrari Dino 246 GT",
    "#412": "Time Attack - Car Challenge - Classics - Lancia Stratos",
    "#413": "Time Attack - Car Challenge - Classics - Toyota 2000GT",
    "#414": "Time Attack - Car Challenge - Sports Coupe - Lexus SC 430",
    "#415": "Time Attack - Car Challenge - Sports Coupe - Jaguar XKR",
    "#416": "Time Attack - Car Challenge - Sports Coupe - Cadillac XLR",
    "#417": "Time Attack - Car Challenge - Sports Coupe - Morgan Aero 8",
    "#418": "Time Attack - Car Challenge - Sports Coupe - Porsche 911 Carrera Coupe (996)",
    "#419": "Time Attack - Car Challenge - Sports Coupe - Iceni",
    "#420": "Time Attack - Car Challenge - American Muscle - Chevrolet Camaro SS",
    "#421": "Time Attack - Car Challenge - American Muscle - Corvette Sting Ray",
    "#422": "Time Attack - Car Challenge - American Muscle - Ford Mustang Fastback 2+2",
    "#423": "Time Attack - Car Challenge - American Muscle - Ford SVT Mustang Cobra",
    "#424": "Time Attack - Car Challenge - Super Car - Chevrolet Corvette Z06",
    "#425": "Time Attack - Car Challenge - American Muscle - Pontiac GTO",
    "#426": "Time Attack - Car Challenge - American Muscle - Chevrolet Camaro Z28",
    "#427": "Time Attack - Car Challenge - American Muscle - Pontiac Trans Am",
    "#428": "Time Attack - Car Challenge - Super Car - Dodge Viper GTS",
    "#429": "Time Attack - Car Challenge - Super Car - Ferrari 360 Modena",
    "#430": "Time Attack - Car Challenge - Super Car - Porsche 911 Turbo (996)",
    "#431": "Time Attack - Car Challenge - Track Specials - Dodge Viper SRT-10",
    "#432": "Time Attack - Car Challenge - Super Car - Ferrari 360 Spider",
    "#433": "Time Attack - Car Challenge - Super Car - TVR Tuscan Speed 6",
    "#434": "Time Attack - Car Challenge - Grand Touring - Lotus Esprit V8",
    "#435": "Time Attack - Car Challenge - Super Car - Ferrari 355 F1",
    "#436": "Time Attack - Car Challenge - Grand Touring - Ferrari 550 Barchetta",
    "#437": "Time Attack - Car Challenge - Grand Touring - Mercedes SL55 AMG",
    "#438": "Time Attack - Car Challenge - Grand Touring - Ferrari 575M Maranello",
    "#439": "Time Attack - Car Challenge - Grand Touring - Aston Martin Vanquish",
    "#440": "Time Attack - Car Challenge - Grand Touring - Ferrari Testarossa",
    "#441": "Time Attack - Car Challenge - Extreme - Ascari KZ1",
    "#442": "Time Attack - Car Challenge - Track Specials - Honda NSX Type-R (J)",
    "#443": "Time Attack - Car Challenge - Track Specials - Lotus Exige",
    "#444": "Time Attack - Car Challenge - Track Specials - Noble M12 GTO3",
    "#445": "Time Attack - Car Challenge - Track Specials - Porsche 911 GT3 (996)",
    "#446": "Time Attack - Car Challenge - Track Specials - Ferrari Challenge Stradale",
    "#447": "Time Attack - Car Challenge - Track Specials - Vauxhall VX220 Turbo",
    "#448": "Time Attack - Car Challenge - Extreme - Ferrari F50",
    "#449": "Time Attack - Car Challenge - Extreme - Porsche 911 GT2 (993)",
    "#450": "Time Attack - Car Challenge - Extreme - Ford GT40",
    "#451": "Time Attack - Car Challenge - Extreme - Ferrari F40",
    "#452": "Time Attack - Car Challenge - Extreme - Porsche 959",
    "#453": "Time Attack - Car Challenge - Extreme - Jaguar XJ220",
    "#454": "Time Attack - Car Challenge - Ultimate - Saleen S7",
    "#455": "Time Attack - Car Challenge - Ultimate - Porsche Carrera GT",
    "#456": "Time Attack - Car Challenge - Ultimate - Koenigsegg CC V8S",
    "#457": "Time Attack - Car Challenge - Ultimate - Enzo Ferrari",
    "#458": "Time Attack - Car Challenge - Ultimate - Pagani Zonda S",
    "#459": "Time Attack - Car Challenge - Ultimate - Ford GT",
    "#460": "Time Attack - Car Challenge - Super Car - Delfino Feroce",
    "#461": "Time Attack - Car Challenge - Classics - Ferrari 250 GTO",
    "#462": "Time Attack - Car Challenge - Ultimate - Mercedes CLK-GTR",
    "#463": "Time Attack - Car Challenge - Ultimate - Porsche 911 GT1",
    "#464": "Time Attack - Car Challenge - Ultimate - TVR Cebera Speed 12",
    "#468": "All Time Ghost Challenge - Barcelona Speed",
    "#469": "All Time Ghost Challenge - Florence Speed",
    "#470": "All Time Ghost Challenge - Hong Kong Speed",
    "#473": "Weekly Hot Lap Series",
    "#474": "Time Attack - Car Challenge - Paris Booster Pack - BMW M3 CSL",
    "#475": "Time Attack - Car Challenge - Long Beach Booster Pack - VW Nardo",
    "#476": "Time Attack - Car Challenge - Paris Booster Pack - Chevrolet Corvette C6",
    "#477": "Time Attack - Car Challenge - Long Beach Booster Pack - Subaru Impreza 22B STi",
    "#478": "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 250TR",
    "#479": "Time Attack - Car Challenge - Paris Booster Pack - Porsche 356A Carrera Speedster",
    "#480": "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 365 GTS4",
    "#481": "Time Attack - Car Challenge - Paris Booster Pack - BMW 645Ci",
    "#482": "Time Attack - Car Challenge - Paris Booster Pack - Ferrari 288 GTO",
    "#483": "Time Attack - Car Challenge - Long Beach Booster Pack - Ariel Atom 2",
    "#484": "Time Attack - Car Challenge - Long Beach Booster Pack - Dodge Ram SRT-10",
    "#485": "Time Attack - Car Challenge - Long Beach Booster Pack - Dodge Challenger R/T Hemi",
    "#487": "Time Attack - Car Challenge - Long Beach Booster Pack - Ferrari 612 Scaglietti",
    "#489": "Time Attack - Car Challenge - Long Beach Booster Pack - Porsche 911 GT2 Clubsport",
    "#490": "Time Attack - Circuit Challenge - Long Beach - Long Beach Challenge",
    "#491": "Time Attack - Circuit Challenge - Long Beach - Rainbow Lagoon",
    "#492": "Time Attack - Circuit Challenge - Long Beach - Coastal Run",
    "#493": "Time Attack - Circuit Challenge - Long Beach - Dolphin Loop",
    "#494": "Time Attack - Circuit Challenge - Long Beach - LBC (Long Beach City)",
    "#495": "Time Attack - Circuit Challenge - Long Beach - Aquarium",
    "#496": "Time Attack - Circuit Challenge - Long Beach - CC Circular",
    "#497": "Time Attack - Circuit Challenge - Long Beach - Ocean Boulevard",
    "#501": "Time Attack - Car Challenge - Long Beach Booster Pack - Radical SR3 Turbo",
    "#502": "Time Attack - Circuit Challenge - Paris - Le Circuit Complet",
    "#503": "Time Attack - Circuit Challenge - Paris - Les Deux Ponts",
    "#504": "Time Attack - Circuit Challenge - Paris - Elysees Challenge",
    "#505": "Time Attack - Circuit Challenge - Paris - Les Monuments Celebres",
    "#506": "Time Attack - Circuit Challenge - Paris - L'Arc de Triomphe",
    "#507": "Time Attack - Circuit Challenge - Paris - Avenue D'lena",
    "#508": "Time Attack - Circuit Challenge - Paris - Circuit Interieur",
    "#509": "Time Attack - Car Challenge - Paris Booster Pack - TVR Cerbera Speed 12"
};

// Helper function to convert leaderboard key to numeric ID
function getLeaderboardId(key) {
    // Extract number from "#001" format
    return parseInt(key.replace('#', ''), 10);
}

// Helper function to check if a leaderboard ID should show the OG toggle
function shouldShowOGToggle(leaderboardId) {
    const id = parseInt(leaderboardId, 10);
    
    // IDs 1-12 (but not 13, 14, 15)
    if (id >= 1 && id <= 12) return true;
    
    // IDs 16-17
    if (id >= 16 && id <= 17) return true;
    
    // ID 37
    if (id === 37) return true;
    
    // IDs 38-269 (continuous range)
    if (id >= 38 && id <= 269) return true;
    
    // IDs 468-470
    if (id >= 468 && id <= 470) return true;
    
    return false;
}

// Determine which API endpoint to use based on leaderboard ID
function getEndpointForLeaderboard(leaderboardId) {
    const id = parseInt(leaderboardId, 10);
    
    // GeometryWars: ID 15
    if (id === 15) {
        return 'geometrywars';
    }
    
    // KudosWorldSeries: Range 38-209
    if (id >= 38 && id <= 209) {
        return 'kudosworldseries';
    }
    
    // TimeAttack: Ranges 271-467 and 474-509
    if ((id >= 271 && id <= 467) || (id >= 474 && id <= 509)) {
        return 'timeattack';
    }
    
    // LeaderboardChallengeKudos: Ranges 2-17, 25-28, 33-36, 210-269
    if ((id >= 2 && id <= 17) || (id >= 25 && id <= 28) || (id >= 33 && id <= 36) || (id >= 210 && id <= 269)) {
        return 'leaderboardchallengekudos';
    }
    
    // LeaderboardChallengeTime: IDs 20, 22-24, 29-32, 37, 468-470, 473, 510, 760
    if (id === 20 || (id >= 22 && id <= 24) || (id >= 29 && id <= 32) || id === 37 || 
        (id >= 468 && id <= 470) || id === 473 || id === 510 || id === 760) {
        return 'leaderboardchallengetime';
    }
    
    // Default to OG for any other IDs (like 1, 18, 19, 21, etc.)
    return 'og';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateLeaderboardDropdown();
    setupEventListeners();
    // Show toggle for leaderboard ID 1 (default) - it supports OG toggle
    const toggleSection = document.getElementById('toggleSection');
    if (shouldShowOGToggle(1)) {
        toggleSection.style.display = 'block';
    }
    // Load default leaderboard ID 1 on page load
    loadLeaderboardData(1);
});

// Populate the leaderboard dropdown
function populateLeaderboardDropdown() {
    const select = document.getElementById('leaderboardSelect');
    if (!select) return;
    
    // Sort keys numerically
    const sortedKeys = Object.keys(leaderboardNames).sort((a, b) => {
        return getLeaderboardId(a) - getLeaderboardId(b);
    });
    
    sortedKeys.forEach(key => {
        const id = getLeaderboardId(key);
        // Hide leaderboard IDs 2-14
        if (id >= 2 && id <= 14) {
            return; // Skip these IDs
        }
        
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${key} - ${leaderboardNames[key]}`;
        if (id === 1) {
            option.selected = true; // Default to ID 1
        }
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('searchBtn').addEventListener('click', handleSearch);
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    document.getElementById('leaderboardSelect').addEventListener('change', () => {
        // Show/hide OG toggle based on leaderboard ID
        const leaderboardId = document.getElementById('leaderboardSelect').value;
        const toggleSection = document.getElementById('toggleSection');
        if (shouldShowOGToggle(leaderboardId)) {
            toggleSection.style.display = 'block';
        } else {
            toggleSection.style.display = 'none';
            document.getElementById('enableOGToggle').checked = false;
        }
        // Auto-load when leaderboard changes
        handleSearch();
    });
    document.getElementById('enableOGToggle').addEventListener('change', () => {
        // Reload data when toggle changes
        handleSearch();
    });
}

// Handle search
function handleSearch() {
    const leaderboardId = document.getElementById('leaderboardSelect').value;
    const playerName = document.getElementById('playerName').value.trim();
    
    if (playerName) {
        searchPlayer(playerName, leaderboardId);
    } else {
        loadLeaderboardData(leaderboardId);
    }
}

// Load leaderboard data by ID with progress tracking
async function loadLeaderboardData(leaderboardId) {
    showLoading();
    hideResults();
    updateProgress(10);
    
    try {
        const id = parseInt(leaderboardId, 10);
        let data = [];
        let ogData = [];
        
        // Special handling for leaderboard ID 1 - use api2 endpoint
        if (id === 1) {
            // Load from api2 endpoint
            const api2Data = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = 10 + (e.loaded / e.total) * 40; // 10-50%
                        updateProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    updateProgress(50);
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(Array.isArray(data) ? data : [data]);
                        } catch (e) {
                            reject(new Error('Failed to parse api2 response'));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('GET', `${API2_BASE_URL}/xbltotal`);
                xhr.send();
            });
            
            data = api2Data;
            
            // If OG toggle is enabled, also load OG data
            const enableOG = document.getElementById('enableOGToggle').checked;
            if (enableOG) {
                ogData = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    
                    xhr.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = 50 + (e.loaded / e.total) * 40; // 50-90%
                            updateProgress(percentComplete);
                        }
                    });
                    
                    xhr.addEventListener('load', () => {
                        updateProgress(90);
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                resolve(Array.isArray(data) ? data : [data]);
                            } catch (e) {
                                resolve([]); // Don't fail if OG fails
                            }
                        } else {
                            resolve([]); // Don't fail if OG fails
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        resolve([]); // Don't fail if OG fails
                    });
                    
                    xhr.open('GET', `${API_BASE_URL}/og?leaderboard_id=1`);
                    xhr.send();
                });
            } else {
                updateProgress(90);
            }
        } else if (shouldShowOGToggle(id)) {
            // For other leaderboards that support OG toggle, load from standard endpoint
            const endpoint = getEndpointForLeaderboard(leaderboardId);
            const url = `${API_BASE_URL}/${endpoint}?leaderboard_id=${leaderboardId}`;
            
            data = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = 10 + (e.loaded / e.total) * 40; // 10-50%
                        updateProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    updateProgress(50);
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(Array.isArray(data) ? data : [data]);
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('GET', url);
                xhr.send();
            });
            
            // If OG toggle is enabled, also load OG data
            const enableOG = document.getElementById('enableOGToggle').checked;
            if (enableOG) {
                ogData = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    
                    xhr.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = 50 + (e.loaded / e.total) * 40; // 50-90%
                            updateProgress(percentComplete);
                        }
                    });
                    
                    xhr.addEventListener('load', () => {
                        updateProgress(90);
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                resolve(Array.isArray(data) ? data : [data]);
                            } catch (e) {
                                resolve([]); // Don't fail if OG fails
                            }
                        } else {
                            resolve([]); // Don't fail if OG fails
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        resolve([]); // Don't fail if OG fails
                    });
                    
                    xhr.open('GET', `${API_BASE_URL}/og?leaderboard_id=${id}`);
                    xhr.send();
                });
            } else {
                updateProgress(90);
            }
        } else {
            // For other leaderboards, use the standard endpoint
            const endpoint = getEndpointForLeaderboard(leaderboardId);
            const url = `${API_BASE_URL}/${endpoint}?leaderboard_id=${leaderboardId}`;
            
            data = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = 10 + (e.loaded / e.total) * 80; // 10-90%
                        updateProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    updateProgress(90);
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(Array.isArray(data) ? data : [data]);
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('GET', url);
                xhr.send();
            });
        }
        
        updateProgress(100);
        
        // Add OG data to the list if enabled (as separate entries, not merged)
        if (shouldShowOGToggle(id) && ogData.length > 0) {
            // Add all OG entries as separate entries to the data array
            ogData.forEach(ogItem => {
                if (ogItem.name) {
                    const newEntry = { ...ogItem };
                    // Ensure it has leaderboard_id set correctly
                    newEntry.leaderboard_id = id;
                    data.push(newEntry);
                }
            });
            
            // Sort the ENTIRE combined list by kudos/score (highest to lowest)
            // This ensures api2 and OG entries are interleaved by kudos score
            // OG uses 'score' field, api2 uses 'kudos' field - they're the same thing
            data.sort((a, b) => {
                // Get kudos value from either 'kudos' or 'score' field
                const getKudosValue = (item) => {
                    const value = item.kudos !== null && item.kudos !== undefined ? item.kudos : 
                                  (item.score !== null && item.score !== undefined ? item.score : null);
                    if (value === null || value === undefined) return 0;
                    return typeof value === 'string' ? parseInt(value) : value;
                };
                
                const kudosA = getKudosValue(a) || 0;
                const kudosB = getKudosValue(b) || 0;
                return kudosB - kudosA; // Descending order (highest first)
            });
        } else if (shouldShowOGToggle(id)) {
            // Even without OG, sort data by kudos/score
            data.sort((a, b) => {
                const getKudosValue = (item) => {
                    const value = item.kudos !== null && item.kudos !== undefined ? item.kudos : 
                                  (item.score !== null && item.score !== undefined ? item.score : null);
                    if (value === null || value === undefined) return 0;
                    return typeof value === 'string' ? parseInt(value) : value;
                };
                
                const kudosA = getKudosValue(a) || 0;
                const kudosB = getKudosValue(b) || 0;
                return kudosB - kudosA; // Descending order (highest first)
            });
        }
        
        setTimeout(() => {
            displayLeaderboardResults(data, leaderboardId);
            hideLoading();
        }, 100);
    } catch (error) {
        console.error('Failed to load leaderboard data:', error);
        hideLoading();
        showError('Failed to load leaderboard data. Please try again.');
    }
}

// Search for a player with progress tracking
async function searchPlayer(playerName, leaderboardId) {
    showLoading();
    hideResults();
    updateProgress(10);
    
    try {
        const id = parseInt(leaderboardId, 10);
        let data = [];
        let ogData = [];
        
        // Special handling for leaderboard ID 1 - use api2 endpoint
        if (id === 1) {
            // Load from api2 endpoint with name filter
            const api2Data = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = 10 + (e.loaded / e.total) * 40; // 10-50%
                        updateProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    updateProgress(50);
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            resolve(Array.isArray(data) ? data : [data]);
                        } catch (e) {
                            reject(new Error('Failed to parse api2 response'));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('GET', `${API2_BASE_URL}/xbltotal?name=${encodeURIComponent(playerName)}`);
                xhr.send();
            });
            
            data = api2Data;
            
            // If OG toggle is enabled, also load OG data
            const enableOG = document.getElementById('enableOGToggle').checked;
            if (enableOG) {
                ogData = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    
                    xhr.addEventListener('progress', (e) => {
                        if (e.lengthComputable) {
                            const percentComplete = 50 + (e.loaded / e.total) * 40; // 50-90%
                            updateProgress(percentComplete);
                        }
                    });
                    
                    xhr.addEventListener('load', () => {
                        updateProgress(90);
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                resolve(Array.isArray(data) ? data : [data]);
                            } catch (e) {
                                resolve([]); // Don't fail if OG fails
                            }
                        } else {
                            resolve([]); // Don't fail if OG fails
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        resolve([]); // Don't fail if OG fails
                    });
                    
                    xhr.open('GET', `${API_BASE_URL}/og?name=${encodeURIComponent(playerName)}&leaderboard_id=1`);
                    xhr.send();
                });
            } else {
                updateProgress(90);
            }
            
            // Add OG data to the list if enabled (as separate entries, not merged)
            if (ogData.length > 0) {
                // Add all OG entries as separate entries to the data array
                ogData.forEach(ogItem => {
                    if (ogItem.name) {
                        const newEntry = { ...ogItem };
                        // Ensure it has leaderboard_id set to 1
                        newEntry.leaderboard_id = 1;
                        data.push(newEntry);
                    }
                });
                
                // Sort the ENTIRE combined list by kudos/score (highest to lowest)
                // This ensures api2 and OG entries are interleaved by kudos score
                // OG uses 'score' field, api2 uses 'kudos' field - they're the same thing
                data.sort((a, b) => {
                    // Get kudos value from either 'kudos' or 'score' field
                    const getKudosValue = (item) => {
                        const value = item.kudos !== null && item.kudos !== undefined ? item.kudos : 
                                      (item.score !== null && item.score !== undefined ? item.score : null);
                        if (value === null || value === undefined) return 0;
                        return typeof value === 'string' ? parseInt(value) : value;
                    };
                    
                    const kudosA = getKudosValue(a) || 0;
                    const kudosB = getKudosValue(b) || 0;
                    return kudosB - kudosA; // Descending order (highest first)
                });
            } else {
                // Even without OG, sort api2 data by kudos
                data.sort((a, b) => {
                    const kudosA = (a.kudos !== null && a.kudos !== undefined) ? parseInt(a.kudos) || 0 : 0;
                    const kudosB = (b.kudos !== null && b.kudos !== undefined) ? parseInt(b.kudos) || 0 : 0;
                    return kudosB - kudosA; // Descending order (highest first)
                });
            }
            
            if (!data || data.length === 0) {
                showError(`No results found for "${playerName}" in leaderboard ${leaderboardId}`);
                hideLoading();
                return;
            }
            
            // Format results for display
            const combinedResults = {};
            combinedResults['xbltotal'] = data;
            displaySearchResults(combinedResults, playerName);
            hideLoading();
        } else if (leaderboardId) {
            // For other leaderboards, use the standard endpoint
            const endpoint = getEndpointForLeaderboard(leaderboardId);
            const url = `${API_BASE_URL}/${endpoint}?name=${encodeURIComponent(playerName)}&leaderboard_id=${leaderboardId}`;
            
            const data = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = 10 + (e.loaded / e.total) * 80;
                        updateProgress(percentComplete);
                    }
                });
                
                xhr.addEventListener('load', () => {
                    updateProgress(90);
                    if (xhr.status === 200) {
                        try {
                            const data = JSON.parse(xhr.responseText);
                            updateProgress(100);
                            setTimeout(() => resolve(data), 100);
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                });
                
                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });
                
                xhr.open('GET', url);
                xhr.send();
            });
            
            if (!data || (Array.isArray(data) && data.length === 0)) {
                showError(`No results found for "${playerName}" in leaderboard ${leaderboardId}`);
                hideLoading();
                return;
            }
            
            // Format results for display
            const combinedResults = {};
            combinedResults[endpoint] = Array.isArray(data) ? data : [data];
            displaySearchResults(combinedResults, playerName);
            hideLoading();
        } else {
            // If no leaderboard ID, search across all relevant endpoints
            const endpoints = [
                'geometrywars',
                'kudosworldseries',
                'leaderboardchallengekudos',
                'leaderboardchallengetime',
                'og',
                'timeattack'
            ];
            
            const totalEndpoints = endpoints.length;
            let completed = 0;
            
            const searchPromises = endpoints.map((endpoint) => {
                return new Promise((resolve) => {
                    const xhr = new XMLHttpRequest();
                    const url = `${API_BASE_URL}/${endpoint}?name=${encodeURIComponent(playerName)}`;
                    
                    xhr.addEventListener('load', () => {
                        completed++;
                        const progress = 10 + (completed / totalEndpoints) * 85; // 10-95%
                        updateProgress(progress);
                        
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                resolve(Array.isArray(data) ? data : [data]);
                            } catch (e) {
                                resolve([]);
                            }
                        } else {
                            resolve([]);
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        completed++;
                        const progress = 10 + (completed / totalEndpoints) * 85;
                        updateProgress(progress);
                        resolve([]);
                    });
                    
                    xhr.open('GET', url);
                    xhr.send();
                });
            });
            
            const results = await Promise.all(searchPromises);
            updateProgress(100);
            
            // Combine results
            const combinedResults = {};
            endpoints.forEach((endpoint, index) => {
                if (results[index] && results[index].length > 0) {
                    combinedResults[endpoint] = results[index];
                }
            });
            
            if (Object.keys(combinedResults).length === 0) {
                showError(`No results found for "${playerName}"`);
                hideLoading();
                return;
            }
            
            displaySearchResults(combinedResults, playerName);
            hideLoading();
        }
    } catch (error) {
        console.error('Failed to search player:', error);
        hideLoading();
        showError('Failed to search player. Please try again.');
    }
}

// Display leaderboard results
function displayLeaderboardResults(data, leaderboardId) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    // Handle both array and object responses
    let dataArray = [];
    if (Array.isArray(data)) {
        dataArray = data;
    } else if (data && typeof data === 'object') {
        // If it's an object, try to extract arrays from it
        Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
                dataArray = dataArray.concat(data[key]);
            }
        });
    }
    
    if (!dataArray || dataArray.length === 0) {
        showError(`No data found for leaderboard ID ${leaderboardId}`);
        return;
    }
    
    // Get leaderboard name for display
    const leaderboardKey = Object.keys(leaderboardNames).find(key => getLeaderboardId(key) === parseInt(leaderboardId, 10));
    const leaderboardName = leaderboardKey ? `${leaderboardKey} - ${leaderboardNames[leaderboardKey]}` : `Leaderboard ID: ${leaderboardId}`;
    
    const leaderboardIdNum = parseInt(leaderboardId, 10);
    
    // Sort by kudos/score (highest to lowest) for leaderboard ID 1
    // Note: Data should already be sorted after merging in loadLeaderboardData, but we'll sort again to ensure consistency
    // This ensures api2 and OG entries are properly interleaved by kudos score
    // OG uses 'score' field, api2 uses 'kudos' field - they're the same thing
    if (leaderboardIdNum === 1) {
        dataArray.sort((a, b) => {
            // Get kudos value from either 'kudos' or 'score' field
            const getKudosValue = (item) => {
                const value = item.kudos !== null && item.kudos !== undefined ? item.kudos : 
                              (item.score !== null && item.score !== undefined ? item.score : null);
                if (value === null || value === undefined) return 0;
                return typeof value === 'string' ? parseInt(value) : value;
            };
            
            const kudosA = getKudosValue(a) || 0;
            const kudosB = getKudosValue(b) || 0;
            return kudosB - kudosA; // Descending order (highest first)
        });
    } else if (leaderboardIdNum === 15) {
        // Sort leaderboard ID 15 by hiscore (highest to lowest)
        dataArray.sort((a, b) => {
            const hiscoreA = (a.hiscore !== null && a.hiscore !== undefined) ? 
                            (typeof a.hiscore === 'string' ? parseInt(a.hiscore) : a.hiscore) || 0 : 0;
            const hiscoreB = (b.hiscore !== null && b.hiscore !== undefined) ? 
                            (typeof b.hiscore === 'string' ? parseInt(b.hiscore) : b.hiscore) || 0 : 0;
            return hiscoreB - hiscoreA; // Descending order (highest first)
        });
    }
    
    // Use 'xbltotal' for leaderboard ID 1, otherwise use the standard endpoint
    const endpoint = parseInt(leaderboardId, 10) === 1 ? 'xbltotal' : getEndpointForLeaderboard(leaderboardId);
    let html = `<div class="leaderboard-info"><h3>${leaderboardName}</h3></div>`;
    html += createTableSection(endpoint, dataArray, parseInt(leaderboardId, 10) === 1);
    
    container.innerHTML = html;
    showResults();
}

// Display search results
function displaySearchResults(data, playerName) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    
    let html = `<div class="search-info"><h3>Results for: ${playerName}</h3></div>`;
    
    // Get current leaderboard ID to determine if it's ID 1 or ID 15
    const leaderboardId = document.getElementById('leaderboardSelect').value;
    const leaderboardIdNum = parseInt(leaderboardId, 10);
    const isLeaderboard1 = leaderboardIdNum === 1;
    const isLeaderboard15 = leaderboardIdNum === 15;
    
    Object.keys(data).forEach(tableName => {
        let tableData = data[tableName];
        
        // Sort by kudos/score for leaderboard ID 1, or hiscore for ID 15
        // Note: Data should already be sorted after merging, but we'll sort again to ensure consistency
        if (Array.isArray(tableData)) {
            if (isLeaderboard1) {
                // For leaderboard ID 1, sort by kudos/score
                // OG uses 'score' field, api2 uses 'kudos' field - they're the same thing
                tableData = [...tableData].sort((a, b) => {
                    // Get kudos value from either 'kudos' or 'score' field
                    const getKudosValue = (item) => {
                        const value = item.kudos !== null && item.kudos !== undefined ? item.kudos : 
                                      (item.score !== null && item.score !== undefined ? item.score : null);
                        if (value === null || value === undefined) return 0;
                        return typeof value === 'string' ? parseInt(value) : value;
                    };
                    
                    const kudosA = getKudosValue(a) || 0;
                    const kudosB = getKudosValue(b) || 0;
                    return kudosB - kudosA; // Descending order (highest first)
                });
            } else if (isLeaderboard15) {
                // For leaderboard ID 15, sort by hiscore
                tableData = [...tableData].sort((a, b) => {
                    const hiscoreA = (a.hiscore !== null && a.hiscore !== undefined) ? 
                                    (typeof a.hiscore === 'string' ? parseInt(a.hiscore) : a.hiscore) || 0 : 0;
                    const hiscoreB = (b.hiscore !== null && b.hiscore !== undefined) ? 
                                    (typeof b.hiscore === 'string' ? parseInt(b.hiscore) : b.hiscore) || 0 : 0;
                    return hiscoreB - hiscoreA; // Descending order (highest first)
                });
            }
        }
        
        html += createTableSection(tableName, tableData, isLeaderboard1);
    });
    
    container.innerHTML = html;
    showResults();
}

// Create a table section for a specific table type
function createTableSection(tableName, rows, isLeaderboard1 = false) {
    if (!rows || rows.length === 0) return '';
    
    // Fields to hide for leaderboard ID 1
    const hiddenFieldsLeaderboard1 = ['data_date', 'folder_date', 'id', 'leaderboard_id', 'sync_id', 'rn'];
    
    // Fields to hide for all other leaderboards (except ID 1)
    const hiddenFieldsOther = ['id', 'rn', 'sync_id', 'folder_date'];
    
    // Get all unique keys from all rows
    const allKeys = new Set();
    rows.forEach(row => {
        Object.keys(row).forEach(key => {
            if (key !== 'source_table') {
                const keyLower = key.toLowerCase();
                // Hide specified fields based on leaderboard ID
                if (isLeaderboard1) {
                    // For leaderboard ID 1, hide specific fields
                    if (!hiddenFieldsLeaderboard1.includes(keyLower)) {
                        allKeys.add(key);
                    }
                } else {
                    // For all other leaderboards, hide id, rn, sync_id, folder_date
                    if (!hiddenFieldsOther.includes(keyLower)) {
                        allKeys.add(key);
                    }
                }
            }
        });
    });
    
    let keys;
    
    // For leaderboard ID 1, use specific column order
    if (isLeaderboard1) {
        const columnOrder = ['rank', 'name', 'first_place_finishes', 'second_place_finishes', 'third_place_finishes', 'races_completed', 'kudos_rank', 'kudos'];
        keys = [];
        
        // Add columns in specified order
        columnOrder.forEach(col => {
            if (allKeys.has(col)) {
                keys.push(col);
                allKeys.delete(col);
            }
        });
        
        // Add any remaining columns
        keys = keys.concat(Array.from(allKeys).sort());
    } else {
        // For other leaderboards, sort alphabetically
        keys = Array.from(allKeys).sort();
    }
    
    let html = `<div class="table-section">
        <h4 class="table-title">${formatTableName(tableName)}</h4>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>`;
    
    keys.forEach(key => {
        html += `<th>${formatColumnName(key)}</th>`;
    });
    
    html += `</tr></thead><tbody>`;
    
    rows.forEach(row => {
        html += `<tr>`;
        keys.forEach(key => {
            const value = row[key];
            html += `<td>${formatValue(value, key)}</td>`;
        });
        html += `</tr>`;
    });
    
    html += `</tbody></table></div></div>`;
    
    return html;
}

// Format table name for display
function formatTableName(name) {
    return name.replace(/([A-Z])/g, ' $1').trim();
}

// Format column name for display
function formatColumnName(name) {
    return name.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Format value for display
function formatValue(value, key = '') {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'number') return value.toLocaleString();
    
    // Special handling for data_date - extract just the date part if it contains extra info
    if (key.toLowerCase() === 'data_date') {
        const str = String(value);
        // If it looks like a date string (contains dashes or slashes), try to parse it
        // Otherwise, if it contains multiple words/spaces, try to extract just the date portion
        if (str.includes(' ') && (str.includes('-') || str.includes('/'))) {
            // Try to extract just the date part (before any extra text)
            // Date formats: YYYY-MM-DD HH:MM:SS or similar
            const dateMatch = str.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2}[\sT]\d{1,2}:\d{1,2}:\d{1,2})|(\d{1,2}[-/]\d{1,2}[-/]\d{4}[\s,]\d{1,2}:\d{1,2}:\d{1,2})/);
            if (dateMatch) {
                return dateMatch[0];
            }
            // If no date pattern found, try to get first part that looks like a date
            const parts = str.split(' ');
            for (const part of parts) {
                if (part.includes('-') || part.includes('/')) {
                    return part;
                }
            }
        }
        // If it's a valid date string, format it nicely
        try {
            const date = new Date(str);
            if (!isNaN(date.getTime())) {
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            }
        } catch (e) {
            // If date parsing fails, return as-is
        }
    }
    
    return String(value);
}

// Update progress bar with slow movement when stuck
let lastProgress = 0;
let slowProgress = 0;
let progressTimer = null;
let isLoading = false;

function updateProgress(percent) {
    const progressBar = document.getElementById('loadingProgress');
    if (!progressBar) return;
    
    // Set the actual progress
    const actualPercent = Math.min(100, Math.max(0, percent));
    lastProgress = actualPercent;
    
    // If we got new progress, update slowProgress to match (but don't go backwards)
    if (actualPercent > slowProgress) {
        slowProgress = actualPercent;
    }
    
    // Always update the bar to the slow progress
    progressBar.style.width = slowProgress + '%';
    
    // Start continuous movement if not already running
    if (!progressTimer && isLoading && slowProgress < 99) {
        progressTimer = setInterval(() => {
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            // Keep moving forward continuously up to 99%
            if (currentWidth < 99) {
                slowProgress = Math.min(99, currentWidth + 0.15);
                progressBar.style.width = slowProgress + '%';
            }
        }, 50); // Update every 50ms for smoother movement
    }
}

// Show/hide loading
function showLoading() {
    isLoading = true;
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'flex';
    // Start continuous movement immediately
    updateProgress(0);
}

function hideLoading() {
    isLoading = false;
    // Clear progress timer
    if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
    }
    lastProgress = 0;
    slowProgress = 0;
    document.getElementById('loadingContainer').style.display = 'none';
}

// Show/hide results
function showResults() {
    document.getElementById('resultsSection').style.display = 'block';
}

function hideResults() {
    document.getElementById('resultsSection').style.display = 'none';
}

// Show error message
function showError(message) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = `<div class="error-message">${message}</div>`;
    showResults();
}

