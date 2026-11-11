export const wasteMaterials = [
  { id: 'bottle', name: 'Plastic bottles', emoji: '🧴', hint: 'PET & containers', color: 'mint' },
  { id: 'chips', name: 'Chips packets', emoji: '🍟', hint: 'Snack wrappers', color: 'pink' },
  { id: 'cardboard', name: 'Cardboard', emoji: '📦', hint: 'Boxes & cartons', color: 'peach' },
  { id: 'cans', name: 'Metal cans', emoji: '🥫', hint: 'Clean empty cans', color: 'lavender' },
  { id: 'glass', name: 'Glass jars', emoji: '🫙', hint: 'Bottles & jars', color: 'sky' },
  { id: 'fabric', name: 'Old clothes', emoji: '👕', hint: 'Fabric scraps', color: 'yellow' },
  { id: 'paper', name: 'Old newspapers', emoji: '📰', hint: 'Paper & magazines', color: 'mint' },
  { id: 'rolls', name: 'Paper rolls', emoji: '🧻', hint: 'Cardboard tubes', color: 'peach' },
  { id: 'caps', name: 'Bottle caps', emoji: '🟠', hint: 'Plastic & metal lids', color: 'pink' },
];

// A project is shown when the user selects ALL materials in its requires array.
export const projects = [
  {
    id: 'planter', title: 'Self-watering planter', emoji: '🌱', requires: ['bottle'],
    level: 'Easy', minutes: 25, description: 'Give a plastic bottle a second life as a tiny indoor garden.',
    steps: ['Wash and dry the bottle.', 'Ask an adult to help cut it safely into two parts.', 'Thread cotton string through the cap as a wick.', 'Fill the upper half with soil and a plant; add water to the lower half.'],
  },
  {
    id: 'pouch', title: 'Snack-wrapper pencil pouch', emoji: '✏️', requires: ['chips'],
    level: 'Medium', minutes: 45, description: 'Turn cleaned snack wrappers into a colorful stationery pouch.',
    steps: ['Wash and fully dry the wrappers.', 'Layer wrappers between pieces of scrap fabric for strength.', 'Stitch the edges together, leaving the top open.', 'Sew or attach a reused zipper along the opening.'],
  },
  {
    id: 'organizer', title: 'Desk organizer', emoji: '🗂️', requires: ['cardboard'],
    level: 'Easy', minutes: 30, description: 'Make a neat organizer for pens, notes, and gadgets.',
    steps: ['Draw compartments on clean cardboard.', 'Cut pieces carefully with suitable scissors.', 'Glue panels into several open compartments.', 'Decorate with leftover paper.'],
  },
  {
    id: 'lantern', title: 'Can lantern', emoji: '🏮', requires: ['cans'],
    level: 'Medium', minutes: 50, description: 'Create a lantern from a tin can using a battery LED light.',
    steps: ['Wash the empty can and check for sharp edges.', 'Ask an adult to safely smooth edges and make decorative holes.', 'Paint the outside with any leftover paint.', 'Put a battery-powered LED light inside; never use an open flame.'],
  },
  {
    id: 'jar', title: 'Mini storage jar', emoji: '🍬', requires: ['glass'],
    level: 'Easy', minutes: 15, description: 'Make a pretty holder for buttons, paper clips, or beads.',
    steps: ['Wash the jar and remove the label.', 'Dry completely.', 'Decorate with scrap paper, string, or fabric.', 'Store non-food household items inside.'],
  },
  {
    id: 'tote', title: 'No-sew tote bag', emoji: '👜', requires: ['fabric'],
    level: 'Easy', minutes: 20, description: 'Transform an old T-shirt into a reusable tote.',
    steps: ['Lay a clean old T-shirt flat.', 'Cut off sleeves and widen the neckline for handles.', 'Cut strips along the bottom hem.', 'Tie matching strips together securely to close the bottom.'],
  },
  {
    id: 'garden', title: 'Vertical mini garden', emoji: '🪴', requires: ['bottle', 'cardboard'],
    level: 'Medium', minutes: 60, description: 'Combine bottles and a recycled display board for a mini green wall.',
    steps: ['Prepare two or three bottle planters.', 'Reinforce the cardboard board so it can support light items only.', 'Attach lightweight empty planters securely.', 'Add small plants and display on a supported flat surface.'],
  },
  {
    id: 'mosaic', title: 'Wrapper mosaic art', emoji: '🎨', requires: ['chips', 'cardboard'],
    level: 'Easy', minutes: 35, description: 'Create shiny wall art from used packaging and cardboard.',
    steps: ['Wash and dry the wrappers thoroughly.', 'Sketch a simple design on the cardboard.', 'Cut colorful pieces from the wrappers.', 'Glue pieces to fill your sketch.'],
  },

  { id: 'bird-feeder', title: 'Bottle bird feeder', emoji: '🐦', requires: ['bottle'], level: 'Easy', minutes: 30, description: 'Create a simple seed dispenser for visiting birds.', steps: ['Clean and dry a bottle.', 'With adult supervision, make two small feeding openings and drainage holes.', 'Add a perch from a smooth reused stick.', 'Hang securely in a sheltered spot and clean regularly.'] },
  { id: 'bottle-scoop', title: 'Garden scoop', emoji: '🪣', requires: ['bottle'], level: 'Easy', minutes: 15, description: 'Reuse a handled plastic container as a lightweight gardening scoop.', steps: ['Wash a sturdy plastic container thoroughly.', 'Draw a slanted scoop outline that retains the handle.', 'Ask an adult to cut carefully and smooth the edges.', 'Use only for dry soil or garden materials, not food.'] },
  { id: 'wrapper-basket', title: 'Woven wrapper basket', emoji: '🧺', requires: ['chips'], level: 'Medium', minutes: 80, description: 'Weave cleaned wrappers into a colorful lightweight basket.', steps: ['Wash and dry at least 12 wrappers.', 'Fold wrappers into strong, uniform strips.', 'Weave strips in a crisscross pattern for the base.', 'Fold and secure sides with stitching or strong tape.'] },
  { id: 'wrapper-bookmark', title: 'Shiny bookmarks', emoji: '🔖', requires: ['chips', 'cardboard'], level: 'Easy', minutes: 20, description: 'Add sparkle to your reading with snack-wrapper bookmarks.', steps: ['Clean and dry the wrappers.', 'Cut thin bookmark rectangles from packaging cardboard.', 'Glue wrapper pieces onto both sides.', 'Round sharp corners and let dry completely.'] },
  { id: 'phone-stand', title: 'Cardboard phone stand', emoji: '📱', requires: ['cardboard'], level: 'Easy', minutes: 20, description: 'Make a handy desk stand from packaging boxes.', steps: ['Sketch two interlocking stand shapes on strong cardboard.', 'Cut carefully along the marked lines.', 'Cut a slot halfway through each piece.', 'Slide pieces together and test with your phone on a flat surface.'] },
  { id: 'drawer-dividers', title: 'Drawer dividers', emoji: '🗄️', requires: ['cardboard'], level: 'Easy', minutes: 25, description: 'Organize small supplies using old delivery boxes.', steps: ['Measure the inside of a drawer.', 'Cut clean cardboard strips to fit.', 'Make matching slots to interlock the strips.', 'Arrange the dividers and sort your supplies.'] },
  { id: 'can-planter', title: 'Painted can planter', emoji: '🌵', requires: ['cans'], level: 'Easy', minutes: 35, description: 'Brighten a windowsill with a reused container for a tiny plant.', steps: ['Wash a can and have an adult remove or cover sharp edges.', 'Add safe drainage holes with adult help.', 'Decorate using leftover paint.', 'Add stones, soil, and a small plant; place on a saucer.'] },
  { id: 'can-utensils', title: 'Desk pen cup', emoji: '🖊️', requires: ['cans'], level: 'Easy', minutes: 20, description: 'A cheerful holder for pens, brushes, and tools.', steps: ['Wash and dry an empty metal can.', 'Have an adult smooth or cover every sharp rim.', 'Wrap it with scrap paper or fabric.', 'Fill with pens and craft tools.'] },
  { id: 'jar-lantern', title: 'Fairy-light jar', emoji: '✨', requires: ['glass'], level: 'Easy', minutes: 15, description: 'Turn a used jar into a cozy LED decoration.', steps: ['Wash a glass jar and inspect for cracks.', 'Dry it and add decorative paper or string.', 'Place a battery-powered LED string inside.', 'Keep it on a stable shelf; do not use a real flame.'] },
  { id: 'jar-herbs', title: 'Kitchen herb starter', emoji: '🌿', requires: ['glass'], level: 'Easy', minutes: 30, description: 'Start herbs from seeds in a reused jar.', steps: ['Clean a jar and fill with small stones for a drainage layer.', 'Add a small amount of potting mix.', 'Plant herb seeds according to packet guidance.', 'Water sparingly because jars have no drainage holes.'] },
  { id: 'fabric-scrunchie', title: 'Fabric hair scrunchie', emoji: '🎀', requires: ['fabric'], level: 'Medium', minutes: 35, description: 'Turn fabric offcuts into a reusable hair accessory.', steps: ['Cut a long rectangle from clean scrap fabric.', 'Fold and stitch along the long edge.', 'Turn the fabric tube right-side out.', 'Insert reused elastic and stitch the ends closed.'] },
  { id: 'fabric-rags', title: 'Reusable cleaning cloths', emoji: '🧽', requires: ['fabric'], level: 'Easy', minutes: 10, description: 'Replace disposable wipes with washable fabric squares.', steps: ['Choose absorbent clean cotton clothing.', 'Cut into equally sized cloth squares.', 'Hem the edges if the fabric frays.', 'Wash between uses; keep cloths for different cleaning jobs separate.'] },
  { id: 'paper-seedpots', title: 'Newspaper seed pots', emoji: '🌱', requires: ['paper'], level: 'Easy', minutes: 20, description: 'Fold biodegradable starter pots from old newspapers.', steps: ['Cut newspaper into strips.', 'Wrap a strip around a small cylindrical jar.', 'Fold the overhang inward to form the base.', 'Remove the jar, add seed-starting mix, and plant seeds.'] },
  { id: 'paper-giftbags', title: 'Recycled gift bags', emoji: '🎁', requires: ['paper'], level: 'Easy', minutes: 25, description: 'Make gift packaging from colorful magazine pages.', steps: ['Choose a sturdy magazine or newspaper sheet.', 'Fold and glue the sides to make a tube.', 'Fold and secure a flat base.', 'Attach reused string handles for light gifts.'] },
  { id: 'roll-organizer', title: 'Cable organizer', emoji: '🔌', requires: ['rolls'], level: 'Easy', minutes: 15, description: 'Keep unplugged cables tidy using paper tubes.', steps: ['Collect dry cardboard tubes.', 'Decorate with leftover paper.', 'Fold disconnected cables loosely and insert into tubes.', 'Label the tubes and store them in a box.'] },
  { id: 'roll-binoculars', title: 'Toy binoculars', emoji: '🔭', requires: ['rolls'], level: 'Easy', minutes: 20, description: 'Create pretend-play binoculars from cardboard tubes.', steps: ['Collect two clean cardboard rolls.', 'Tape the rolls side by side.', 'Decorate with colors or scrap stickers.', 'Attach a short strap if desired; avoid wrapping straps around the neck.'] },
  { id: 'cap-mosaic', title: 'Bottle-cap mosaic', emoji: '🌈', requires: ['caps', 'cardboard'], level: 'Easy', minutes: 40, description: 'Make colorful wall art using collected caps.', steps: ['Wash and dry all caps.', 'Sketch a pattern on strong cardboard.', 'Arrange the caps until you like the design.', 'Glue securely and hang away from small children.'] },
  { id: 'cap-game', title: 'DIY counting game', emoji: '🎲', requires: ['caps'], level: 'Easy', minutes: 20, description: 'Make a colorful sorting and counting activity.', steps: ['Collect and clean assorted caps.', 'Write numbers or draw symbols on large caps.', 'Sort by color or match the numbers.', 'Store safely away from young children due to choking risk.'] },
];
