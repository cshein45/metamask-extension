// Migrations must start at version 1 or later.
// They are objects with a `version` number
// and a `migrate` function.
//
// The `migrate` function receives the previous
// config data format, and returns the new one.

/* eslint node/global-require: "off" */
// (we have to turn off that global-require rule for this file in order to do the import-then-export magic)

const migrations = [
  require('./002').default,
  require('./003').default,
  require('./004').default,
  require('./005').default,
  require('./006').default,
  require('./007').default,
  require('./008').default,
  require('./009').default,
  require('./010').default,
  require('./011').default,
  require('./012').default,
  require('./013').default,
  require('./014').default,
  require('./015').default,
  require('./016').default,
  require('./017').default,
  require('./018').default,
  require('./019').default,
  require('./020').default,
  require('./021').default,
  require('./022').default,
  require('./023').default,
  require('./024').default,
  require('./025').default,
  require('./026').default,
  require('./027').default,
  require('./028').default,
  require('./029').default,
  require('./030').default,
  require('./031').default,
  require('./032').default,
  require('./033').default,
  require('./034').default,
  require('./035').default,
  require('./036').default,
  require('./037').default,
  require('./038').default,
  require('./039').default,
  require('./040').default,
  require('./041').default,
  require('./042').default,
  require('./043').default,
  require('./044').default,
  require('./045').default,
  require('./046').default,
  require('./047').default,
  require('./048').default,
  require('./049').default,
  require('./050').default,
  require('./051').default,
  require('./052').default,
  require('./053').default,
  require('./054').default,
  require('./055').default,
  require('./056').default,
  require('./057').default,
  require('./058').default,
  require('./059').default,
  require('./060').default,
  require('./061').default,
  require('./062').default,
  require('./063').default,
  require('./064').default,
  require('./065').default,
  require('./066').default,
  require('./067').default,
  require('./068').default,
  require('./069').default,
  require('./070').default,
  require('./071').default,
  require('./072').default,
  require('./073').default,
  require('./074').default,
  require('./075').default,
  require('./076').default,
  require('./077').default,
  require('./078'),
  require('./079').default,
  require('./080').default,
  require('./081'),
  require('./082'),
  require('./083'),
  require('./084'),
  require('./085'),
  require('./086'),
  require('./087'),
  require('./088'),
  require('./089'),
  require('./090'),
  require('./091'),
  require('./092'),
  require('./092.1'),
  require('./092.2'),
  require('./092.3'),
  require('./093'),
  require('./094'),
  require('./095'),
  require('./096'),
  require('./097'),
  require('./098'),
  require('./099'),
  require('./100'),
  require('./101'),
  require('./102'),
  require('./103'),
  require('./104'),
  require('./105'),
  require('./106'),
  require('./107'),
  require('./108'),
  require('./109'),
  require('./110'),
  require('./111'),
  require('./112'),
  require('./113'),
  require('./114'),
  require('./115'),
  require('./116'),
  require('./117'),
  require('./118'),
  require('./119'),
  require('./120'),
  require('./120.1'),
  require('./120.2'),
  // require('./120.3'), Renamed to 120.6, do not re-use this number
  require('./120.4'),
  require('./120.5'),
  require('./120.6'),
  require('./121'),
  require('./121.1'),
  require('./121.2'),
  require('./122'),
  require('./123'),
  require('./124'),
  require('./125'),
  require('./125.1'),
  require('./126'),
  require('./126.1'),
  require('./127'),
  require('./128'),
  require('./129'),
  require('./130'),
  require('./131'),
  require('./131.1'),
  require('./132'),
  require('./133'),
  require('./133.1'),
  require('./133.2'),
  require('./134'),
  require('./134.1'),
  require('./135'),
  require('./136'),
  require('./137'),
  require('./138'),
  require('./139'),
  require('./140'),
  require('./141'),
  require('./142'),
  require('./143'),
  require('./143.1'),
  require('./144'),
  require('./145'),
  require('./146'),
  require('./146.1'),
  require('./147'),
  require('./148'),
  require('./149'),
  require('./150'),
  require('./151'),
  require('./152'),
  require('./152.1'),
  require('./152.2'),
  require('./153'),
  require('./154'),
  require('./155'),
  require('./156'),
  require('./156.1'),
  require('./157'),
  require('./158'),
  require('./159'),
  require('./160'),
  require('./161'),
  require('./161.1'),
  require('./162'),
  require('./163'),
  require('./164'),
  require('./165'),
  require('./166'),
  require('./167'),
  require('./168'),
  require('./168.1'),
  require('./169'),
  require('./170'),
  require('./170.1'),
  require('./170.2'),
  require('./171'),
  require('./172'),
];

export default migrations;
