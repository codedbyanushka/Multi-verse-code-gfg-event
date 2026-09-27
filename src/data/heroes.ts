export type Hero = {
  id: string;
  name: string;
  title: string;
  accentColor: string;
  blurb: string;
  imageSlug: string;
};

export const heroes: Hero[] = [
  {
    id: "iron-man",
    name: "Iron Man",
    title: "The Armored Avenger",
    accentColor: "#DC2626", // Deep Red
    blurb: "Billionaire genius Tony Stark didn't just inherit his power—he built it from scraps in a cave. Armed with an indomitable intellect and a suit of bleeding-edge armor, he leads the charge against any threat that dares to challenge Earth. \"I am Iron Man\" wasn't just a revelation; it was a promise to protect the future.",
    imageSlug: "iron-man"
  },
  {
    id: "captain-america",
    name: "Captain America",
    title: "The First Avenger",
    accentColor: "#1D4ED8", // Shield Blue
    blurb: "Steve Rogers proved that true strength isn't about physical power, but unwavering moral conviction. Frozen in ice for decades, this soldier out of time awoke to a world that needed a compass more than ever. Armed with his vibranium shield and unyielding spirit, he stands as the immovable object against injustice.",
    imageSlug: "captain-america"
  },
  {
    id: "thor",
    name: "Thor",
    title: "God of Thunder",
    accentColor: "#00E5FF", // Lightning Cyan
    blurb: "Stripped of his power and banished to Earth, the prince of Asgard learned that worthiness is forged in humility. Wielding the mighty Mjolnir and channeling the raw fury of the storm, Thor Odinson bridges the gap between myths and mortals. His lightning strikes with the wrath of a god, but his heart fights for the people.",
    imageSlug: "thor"
  },
  {
    id: "hulk",
    name: "The Hulk",
    title: "The Gamma Goliath",
    accentColor: "#22C55E", // Gamma Green
    blurb: "A brilliant scientist trapped in a volatile dual existence, Bruce Banner carries the weight of a monster within. When pushed to the brink, his anger unleashes an unstoppable force of nature that can level mountains or save the planet. Despite his chaotic power, it's his underlying humanity that keeps the beast in check.",
    imageSlug: "hulk"
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    title: "The Web-Slinger",
    accentColor: "#E11D48", // Web Red
    blurb: "Bitten by a radioactive spider, teenager Peter Parker quickly learned that with great power comes a heavy burden of responsibility. Swinging high above the streets of New York, he balances the struggles of youth with the life-or-death stakes of a superhero. He may be the friendly neighborhood hero, but his courage knows no limits.",
    imageSlug: "spider-man"
  },
  {
    id: "doctor-strange",
    name: "Doctor Strange",
    title: "Sorcerer Supreme",
    accentColor: "#F59E0B", // Mystic Amber
    blurb: "Once an arrogant, world-renowned surgeon, Stephen Strange lost his hands but found his true calling in the mystic arts. As the Master of the Mystic Arts, he bends reality, rewrites the rules of time, and guards the universe from extra-dimensional threats. His magic proves that the mind is the ultimate weapon.",
    imageSlug: "doctor-strange"
  },
  {
    id: "black-panther",
    name: "Black Panther",
    title: "King of Wakanda",
    accentColor: "#9333EA", // Vibranium Purple
    blurb: "T'Challa is more than a hero; he is a king who must protect his people and their advanced vibranium technology from the shadows. Blending ancient tradition with futuristic science, he fights with the agility and ferocity of his namesake. His leadership reminds the world that true power lies in unity and wisdom.",
    imageSlug: "black-panther"
  }
];
