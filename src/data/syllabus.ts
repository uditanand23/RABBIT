import { Chapter } from '../types';

// Verified NEET (UG) Syllabus aligned with NMC (National Medical Commission) guidelines
// Each chapter contains key conceptual topics. Clearly marked isVerifiedNmcSyllabus: true.
export const INITIAL_NEET_SYLLABUS: Chapter[] = [
  // ==================== PHYSICS - CLASS 11 ====================
  {
    id: 'phy-11-01',
    subjectId: 'physics',
    classLevel: '11',
    order: 1,
    name: 'Units and Measurements',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-01-t1', name: 'SI units, fundamental and derived units', isCompleted: false },
      { id: 'phy-11-01-t2', name: 'Errors in measurement and combinations', isCompleted: false },
      { id: 'phy-11-01-t3', name: 'Significant figures', isCompleted: false },
      { id: 'phy-11-01-t4', name: 'Dimensions of physical quantities & Dimensional analysis', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-02',
    subjectId: 'physics',
    classLevel: '11',
    order: 2,
    name: 'Motion in a Straight Line',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-02-t1', name: 'Frame of reference, Position-time graph, Speed and Velocity', isCompleted: false },
      { id: 'phy-11-02-t2', name: 'Uniform and non-uniform motion, Average speed and Instantaneous velocity', isCompleted: false },
      { id: 'phy-11-02-t3', name: 'Uniformly accelerated motion, Velocity-time and position-time graphs', isCompleted: false },
      { id: 'phy-11-02-t4', name: 'Kinematic equations for uniformly accelerated motion & Motion under gravity', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-03',
    subjectId: 'physics',
    classLevel: '11',
    order: 3,
    name: 'Motion in a Plane',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-03-t1', name: 'Scalars and vectors, Vector addition & subtraction', isCompleted: false },
      { id: 'phy-11-03-t2', name: 'Resolution of vectors, Scalar and Vector product', isCompleted: false },
      { id: 'phy-11-03-t3', name: 'Motion in a plane with constant acceleration', isCompleted: false },
      { id: 'phy-11-03-t4', name: 'Projectile motion (Equation of trajectory, time of flight, range)', isCompleted: false },
      { id: 'phy-11-03-t5', name: 'Uniform circular motion and centripetal acceleration', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-04',
    subjectId: 'physics',
    classLevel: '11',
    order: 4,
    name: 'Laws of Motion',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-04-t1', name: 'Newton’s First Law, Momentum and Second Law of Motion', isCompleted: false },
      { id: 'phy-11-04-t2', name: 'Impulse and Newton’s Third Law of Motion', isCompleted: false },
      { id: 'phy-11-04-t3', name: 'Law of conservation of linear momentum and applications', isCompleted: false },
      { id: 'phy-11-04-t4', name: 'Equilibrium of concurrent forces, Friction (Static and Kinetic)', isCompleted: false },
      { id: 'phy-11-04-t5', name: 'Dynamics of uniform circular motion: Centripetal force and Banking of curves', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-05',
    subjectId: 'physics',
    classLevel: '11',
    order: 5,
    name: 'Work, Energy and Power',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-05-t1', name: 'Work done by constant force and variable force', isCompleted: false },
      { id: 'phy-11-05-t2', name: 'Kinetic energy, Work-energy theorem', isCompleted: false },
      { id: 'phy-11-05-t3', name: 'Potential energy, Conservation of mechanical energy', isCompleted: false },
      { id: 'phy-11-05-t4', name: 'Conservative and non-conservative forces, Spring potential energy', isCompleted: false },
      { id: 'phy-11-05-t5', name: 'Collisions in one and two dimensions (Elastic and Inelastic)', isCompleted: false },
      { id: 'phy-11-05-t6', name: 'Power and Power-velocity relationship', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-06',
    subjectId: 'physics',
    classLevel: '11',
    order: 6,
    name: 'System of Particles and Rotational Motion',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-06-t1', name: 'Centre of mass of two-particle system and rigid body', isCompleted: false },
      { id: 'phy-11-06-t2', name: 'Linear momentum of system of particles, Centre of mass motion', isCompleted: false },
      { id: 'phy-11-06-t3', name: 'Torque, Angular momentum and Conservation of angular momentum', isCompleted: false },
      { id: 'phy-11-06-t4', name: 'Equilibrium of rigid bodies and rigid body rotation', isCompleted: false },
      { id: 'phy-11-06-t5', name: 'Moment of inertia and radius of gyration for standard bodies', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-07',
    subjectId: 'physics',
    classLevel: '11',
    order: 7,
    name: 'Gravitation',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-07-t1', name: 'Universal law of gravitation and Kepler’s laws of planetary motion', isCompleted: false },
      { id: 'phy-11-07-t2', name: 'Acceleration due to gravity and variation with altitude & depth', isCompleted: false },
      { id: 'phy-11-07-t3', name: 'Gravitational potential energy and gravitational potential', isCompleted: false },
      { id: 'phy-11-07-t4', name: 'Escape velocity and orbital velocity of satellite', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-08',
    subjectId: 'physics',
    classLevel: '11',
    order: 8,
    name: 'Mechanical Properties of Solids',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-08-t1', name: 'Elastic behaviour, Stress-strain relationship & Hooke’s law', isCompleted: false },
      { id: 'phy-11-08-t2', name: 'Young’s modulus, Bulk modulus, Shear modulus', isCompleted: false },
      { id: 'phy-11-08-t3', name: 'Elastic potential energy in a stretched wire', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-09',
    subjectId: 'physics',
    classLevel: '11',
    order: 9,
    name: 'Mechanical Properties of Fluids',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-09-t1', name: 'Pressure due to fluid column, Pascal’s law and hydraulic machines', isCompleted: false },
      { id: 'phy-11-09-t2', name: 'Viscosity, Stokes’ law, Terminal velocity, Reynolds number', isCompleted: false },
      { id: 'phy-11-09-t3', name: 'Streamline and turbulent flow, Equation of continuity', isCompleted: false },
      { id: 'phy-11-09-t4', name: 'Bernoulli’s theorem and its applications (Venturi-meter, lift)', isCompleted: false },
      { id: 'phy-11-09-t5', name: 'Surface tension, Surface energy, Angle of contact & Capillarity', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-10',
    subjectId: 'physics',
    classLevel: '11',
    order: 10,
    name: 'Thermal Properties of Matter',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-10-t1', name: 'Heat and temperature, Thermal expansion of solids, liquids and gases', isCompleted: false },
      { id: 'phy-11-10-t2', name: 'Specific heat capacity, Calorimetry and Latent heat', isCompleted: false },
      { id: 'phy-11-10-t3', name: 'Heat transfer: Conduction, Convection and Radiation', isCompleted: false },
      { id: 'phy-11-10-t4', name: 'Newton’s law of cooling and Wien’s displacement law, Stefan’s law', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-11',
    subjectId: 'physics',
    classLevel: '11',
    order: 11,
    name: 'Thermodynamics',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-11-t1', name: 'Thermal equilibrium and Zeroth law of thermodynamics', isCompleted: false },
      { id: 'phy-11-11-t2', name: 'First law of thermodynamics, Internal energy and Work done', isCompleted: false },
      { id: 'phy-11-11-t3', name: 'Isothermal, Adiabatic, Isobaric and Isochoric processes', isCompleted: false },
      { id: 'phy-11-11-t4', name: 'Second law of thermodynamics, Reversible and irreversible processes', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-12',
    subjectId: 'physics',
    classLevel: '11',
    order: 12,
    name: 'Kinetic Theory of Gases',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-12-t1', name: 'Equation of state of perfect gas, Kinetic postulates and pressure expression', isCompleted: false },
      { id: 'phy-11-12-t2', name: 'Kinetic interpretation of temperature, RMS speed of gas molecules', isCompleted: false },
      { id: 'phy-11-12-t3', name: 'Degrees of freedom, Law of equipartition of energy & Specific heats', isCompleted: false },
      { id: 'phy-11-12-t4', name: 'Mean free path', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-13',
    subjectId: 'physics',
    classLevel: '11',
    order: 13,
    name: 'Oscillations',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-13-t1', name: 'Periodic and oscillatory motions, Period and frequency', isCompleted: false },
      { id: 'phy-11-13-t2', name: 'Simple Harmonic Motion (SHM) and equation of displacement', isCompleted: false },
      { id: 'phy-11-13-t3', name: 'Velocity, acceleration and phase in SHM', isCompleted: false },
      { id: 'phy-11-13-t4', name: 'Kinetic and potential energies in SHM', isCompleted: false },
      { id: 'phy-11-13-t5', name: 'Simple pendulum and loaded spring oscillations', isCompleted: false }
    ]
  },
  {
    id: 'phy-11-14',
    subjectId: 'physics',
    classLevel: '11',
    order: 14,
    name: 'Waves',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-11-14-t1', name: 'Wave motion, Transverse and longitudinal waves, Speed of sound wave', isCompleted: false },
      { id: 'phy-11-14-t2', name: 'Displacement relation for progressive wave, Principle of superposition', isCompleted: false },
      { id: 'phy-11-14-t3', name: 'Standing waves in strings and organ pipes, Normal modes', isCompleted: false },
      { id: 'phy-11-14-t4', name: 'Beats and frequency of beats', isCompleted: false }
    ]
  },

  // ==================== PHYSICS - CLASS 12 ====================
  {
    id: 'phy-12-01',
    subjectId: 'physics',
    classLevel: '12',
    order: 15,
    name: 'Electric Charges and Fields',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-01-t1', name: 'Electric charge, Conservation & Coulomb’s law in vector form', isCompleted: false },
      { id: 'phy-12-01-t2', name: 'Electric field due to point charge, Field lines, Electric dipole & Torque', isCompleted: false },
      { id: 'phy-12-01-t3', name: 'Electric flux, Gauss’s theorem and its statement', isCompleted: false },
      { id: 'phy-12-01-t4', name: 'Applications of Gauss’s law: Infinite line charge, Plane sheet, Spherical shell', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-02',
    subjectId: 'physics',
    classLevel: '12',
    order: 16,
    name: 'Electrostatic Potential and Capacitance',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-02-t1', name: 'Electric potential due to point charge and dipole', isCompleted: false },
      { id: 'phy-12-02-t2', name: 'Equipotential surfaces, Potential energy of system of charges', isCompleted: false },
      { id: 'phy-12-02-t3', name: 'Conductors, Dielectrics and Electric polarization', isCompleted: false },
      { id: 'phy-12-02-t4', name: 'Capacitance of parallel plate capacitor with & without dielectric', isCompleted: false },
      { id: 'phy-12-02-t5', name: 'Combination of capacitors (series & parallel) and Energy stored', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-03',
    subjectId: 'physics',
    classLevel: '12',
    order: 17,
    name: 'Current Electricity',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-03-t1', name: 'Electric current, Drift velocity, Mobility and Ohm’s law', isCompleted: false },
      { id: 'phy-12-03-t2', name: 'V-I characteristics, Electrical resistivity and conductivity, Temperature dependence', isCompleted: false },
      { id: 'phy-12-03-t3', name: 'Internal resistance of cell, Potential difference and EMF, Combination of cells', isCompleted: false },
      { id: 'phy-12-03-t4', name: 'Kirchhoff’s laws and simple circuit applications', isCompleted: false },
      { id: 'phy-12-03-t5', name: 'Wheatstone bridge and Meter bridge', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-04',
    subjectId: 'physics',
    classLevel: '12',
    order: 18,
    name: 'Moving Charges and Magnetism',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-04-t1', name: 'Biot-Savart law and magnetic field on axis of circular loop', isCompleted: false },
      { id: 'phy-12-04-t2', name: 'Ampere’s circuital law and magnetic field of long straight solenoid', isCompleted: false },
      { id: 'phy-12-04-t3', name: 'Force on moving charge in magnetic field, Lorentz force', isCompleted: false },
      { id: 'phy-12-04-t4', name: 'Force between two parallel current-carrying conductors', isCompleted: false },
      { id: 'phy-12-04-t5', name: 'Torque on current loop, Moving coil galvanometer and conversion to ammeter/voltmeter', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-05',
    subjectId: 'physics',
    classLevel: '12',
    order: 19,
    name: 'Magnetism and Matter',
    status: 'not_started',
    priority: 'low',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-05-t1', name: 'Bar magnet as an equivalent solenoid, Magnetic field lines', isCompleted: false },
      { id: 'phy-12-05-t2', name: 'Torque on bar magnet in uniform magnetic field', isCompleted: false },
      { id: 'phy-12-05-t3', name: 'Diamagnetic, Paramagnetic and Ferromagnetic substances with examples', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-06',
    subjectId: 'physics',
    classLevel: '12',
    order: 20,
    name: 'Electromagnetic Induction',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-06-t1', name: 'Electromagnetic induction, Faraday’s laws and induced EMF', isCompleted: false },
      { id: 'phy-12-06-t2', name: 'Lenz’s law and conservation of energy', isCompleted: false },
      { id: 'phy-12-06-t3', name: 'Motional EMF and Eddy currents', isCompleted: false },
      { id: 'phy-12-06-t4', name: 'Self-induction and Mutual induction, AC generator', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-07',
    subjectId: 'physics',
    classLevel: '12',
    order: 21,
    name: 'Alternating Current',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-07-t1', name: 'Peak and RMS value of alternating current/voltage', isCompleted: false },
      { id: 'phy-12-07-t2', name: 'Reactance and impedance, LCR series circuit and phasor diagrams', isCompleted: false },
      { id: 'phy-12-07-t3', name: 'Resonance in LCR circuits, Quality factor', isCompleted: false },
      { id: 'phy-12-07-t4', name: 'Power in AC circuits, Wattless current, Transformer', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-08',
    subjectId: 'physics',
    classLevel: '12',
    order: 22,
    name: 'Electromagnetic Waves',
    status: 'not_started',
    priority: 'low',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-08-t1', name: 'Displacement current concept and Maxwell’s equations overview', isCompleted: false },
      { id: 'phy-12-08-t2', name: 'Electromagnetic waves characteristics and transverse nature', isCompleted: false },
      { id: 'phy-12-08-t3', name: 'Electromagnetic spectrum (Radio to Gamma) and practical applications', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-09',
    subjectId: 'physics',
    classLevel: '12',
    order: 23,
    name: 'Ray Optics and Optical Instruments',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-09-t1', name: 'Refraction of light, Total internal reflection and optical fibres', isCompleted: false },
      { id: 'phy-12-09-t2', name: 'Refraction at spherical surfaces, Lens maker’s formula & thin lens formula', isCompleted: false },
      { id: 'phy-12-09-t3', name: 'Combination of thin lenses in contact, Refraction through prism', isCompleted: false },
      { id: 'phy-12-09-t4', name: 'Microscopes and Astronomical Telescopes (magnifying powers)', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-10',
    subjectId: 'physics',
    classLevel: '12',
    order: 24,
    name: 'Wave Optics',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-10-t1', name: 'Huygens principle and proof of reflection and refraction laws', isCompleted: false },
      { id: 'phy-12-10-t2', name: 'Interference of light, Young’s double slit experiment & fringe width', isCompleted: false },
      { id: 'phy-12-10-t3', name: 'Coherent sources and conditions for sustained interference', isCompleted: false },
      { id: 'phy-12-10-t4', name: 'Diffraction due to single slit, Width of central maximum', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-11',
    subjectId: 'physics',
    classLevel: '12',
    order: 25,
    name: 'Dual Nature of Radiation and Matter',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-11-t1', name: 'Photoelectric effect, Hertz and Lenard observations', isCompleted: false },
      { id: 'phy-12-11-t2', name: 'Einstein’s photoelectric equation and threshold frequency', isCompleted: false },
      { id: 'phy-12-11-t3', name: 'Matter waves: de Broglie relation and wavelength of electrons', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-12',
    subjectId: 'physics',
    classLevel: '12',
    order: 26,
    name: 'Atoms',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-12-t1', name: 'Alpha-particle scattering experiment and Rutherford’s atomic model', isCompleted: false },
      { id: 'phy-12-12-t2', name: 'Bohr’s model of hydrogen atom, Radii of orbits and energy levels', isCompleted: false },
      { id: 'phy-12-12-t3', name: 'Hydrogen spectrum (Lyman, Balmer, Paschen series)', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-13',
    subjectId: 'physics',
    classLevel: '12',
    order: 27,
    name: 'Nuclei',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-13-t1', name: 'Composition and size of nucleus, Nuclear density', isCompleted: false },
      { id: 'phy-12-13-t2', name: 'Mass defect, Binding energy per nucleon and variation with mass number', isCompleted: false },
      { id: 'phy-12-13-t3', name: 'Nuclear fission and nuclear fusion processes', isCompleted: false }
    ]
  },
  {
    id: 'phy-12-14',
    subjectId: 'physics',
    classLevel: '12',
    order: 28,
    name: 'Semiconductor Electronics: Materials, Devices and Simple Circuits',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'phy-12-14-t1', name: 'Energy bands in solids, Intrinsic and extrinsic semiconductors', isCompleted: false },
      { id: 'phy-12-14-t2', name: 'p-n junction formation, Forward and reverse bias characteristics', isCompleted: false },
      { id: 'phy-12-14-t3', name: 'Semiconductor diode as rectifier (half wave & full wave)', isCompleted: false },
      { id: 'phy-12-14-t4', name: 'Optoelectronic devices: LED and photodiode, Solar cell', isCompleted: false }
    ]
  },

  // ==================== CHEMISTRY - CLASS 11 ====================
  {
    id: 'chem-11-01',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 1,
    name: 'Some Basic Concepts of Chemistry',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-01-t1', name: 'Mole concept, Molar mass, Percentage composition', isCompleted: false },
      { id: 'chem-11-01-t2', name: 'Empirical and molecular formula', isCompleted: false },
      { id: 'chem-11-01-t3', name: 'Chemical stoichiometry and limiting reagent', isCompleted: false },
      { id: 'chem-11-01-t4', name: 'Concentration terms: Molarity, Molality, Mole fraction', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-02',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 2,
    name: 'Structure of Atom',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-02-t1', name: 'Bohr’s model and hydrogen emission spectrum', isCompleted: false },
      { id: 'chem-11-02-t2', name: 'Dual nature of matter (de Broglie) and Heisenberg uncertainty principle', isCompleted: false },
      { id: 'chem-11-02-t3', name: 'Quantum numbers (n, l, m, s) and shapes of s, p, d orbitals', isCompleted: false },
      { id: 'chem-11-02-t4', name: 'Aufbau principle, Pauli exclusion principle and Hund’s rule', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-03',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 3,
    name: 'Classification of Elements and Periodicity in Properties',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-03-t1', name: 'Modern periodic law and periodic table configuration', isCompleted: false },
      { id: 'chem-11-03-t2', name: 'Periodic trends in atomic and ionic radii, Isoelectronic species', isCompleted: false },
      { id: 'chem-11-03-t3', name: 'Ionization enthalpy and Electron gain enthalpy trends and anomalies', isCompleted: false },
      { id: 'chem-11-03-t4', name: 'Electronegativity (Pauling scale) and valence oxidation states', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-04',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 4,
    name: 'Chemical Bonding and Molecular Structure',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-04-t1', name: 'Ionic bond, Lattice enthalpy, Born-Haber cycle overview', isCompleted: false },
      { id: 'chem-11-04-t2', name: 'Covalent bond, Lewis structures, Formal charge, Fajan’s rules', isCompleted: false },
      { id: 'chem-11-04-t3', name: 'VSEPR theory and geometry of molecules', isCompleted: false },
      { id: 'chem-11-04-t4', name: 'Valence Bond Theory and Hybridization (sp, sp2, sp3, sp3d, sp3d2)', isCompleted: false },
      { id: 'chem-11-04-t5', name: 'Molecular Orbital Theory (MOT), Bond order and Magnetic nature of homonuclear diatomics', isCompleted: false },
      { id: 'chem-11-04-t6', name: 'Hydrogen bonding (Inter and Intramolecular)', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-05',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 5,
    name: 'Chemical Thermodynamics',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-05-t1', name: 'First law of thermodynamics, Internal energy, Enthalpy (ΔH = ΔU + ΔngRT)', isCompleted: false },
      { id: 'chem-11-05-t2', name: 'Hess’s law of constant heat summation and enthalpies of reaction/formation/combustion', isCompleted: false },
      { id: 'chem-11-05-t3', name: 'Second law of thermodynamics, Entropy as state function', isCompleted: false },
      { id: 'chem-11-05-t4', name: 'Gibbs free energy change (ΔG = ΔH - TΔS) and spontaneity criteria', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-06',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 6,
    name: 'Equilibrium',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-06-t1', name: 'Law of chemical equilibrium, Kc and Kp relationship', isCompleted: false },
      { id: 'chem-11-06-t2', name: 'Le Chatelier’s principle (Effect of concentration, temperature, pressure)', isCompleted: false },
      { id: 'chem-11-06-t3', name: 'Ionic equilibrium: Acid-base concepts (Arrhenius, Bronsted, Lewis)', isCompleted: false },
      { id: 'chem-11-06-t4', name: 'Ionization of weak acids/bases, pH scale and Ostwald’s dilution law', isCompleted: false },
      { id: 'chem-11-06-t5', name: 'Common ion effect, Buffer solutions and Henderson-Hasselbalch equation', isCompleted: false },
      { id: 'chem-11-06-t6', name: 'Solubility product (Ksp) and precipitation criteria', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-07',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 7,
    name: 'Redox Reactions',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-07-t1', name: 'Concept of oxidation and reduction, Oxidation number rules', isCompleted: false },
      { id: 'chem-11-07-t2', name: 'Balancing redox reactions: Ion-electron and Oxidation state methods', isCompleted: false },
      { id: 'chem-11-07-t3', name: 'Types of redox reactions including disproportionation', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-08',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 8,
    name: 'Organic Chemistry: Some Basic Principles and Techniques',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-08-t1', name: 'IUPAC nomenclature of organic compounds with polyfunctional groups', isCompleted: false },
      { id: 'chem-11-08-t2', name: 'Isomerism: Structural and Stereoisomerism (Geometrical, Optical)', isCompleted: false },
      { id: 'chem-11-08-t3', name: 'Electronic displacements: Inductive, Electromeric, Resonance and Hyperconjugation', isCompleted: false },
      { id: 'chem-11-08-t4', name: 'Reactive intermediates: Carbocations, Carbanions, Free radicals stability', isCompleted: false },
      { id: 'chem-11-08-t5', name: 'Types of organic reactions (Substitution, Addition, Elimination, Rearrangement)', isCompleted: false }
    ]
  },
  {
    id: 'chem-11-09',
    subjectId: 'chemistry',
    classLevel: '11',
    order: 9,
    name: 'Hydrocarbons',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-11-09-t1', name: 'Alkanes: Conformations of ethane, Free radical halogenation mechanism', isCompleted: false },
      { id: 'chem-11-09-t2', name: 'Alkenes: Preparation, Markovnikov and Anti-Markovnikov addition, Ozonolysis', isCompleted: false },
      { id: 'chem-11-09-t3', name: 'Alkynes: Acidic nature of terminal alkynes, Addition reactions', isCompleted: false },
      { id: 'chem-11-09-t4', name: 'Aromatic hydrocarbons: Huckel’s aromaticity rule, Electrophilic substitution of benzene', isCompleted: false }
    ]
  },

  // ==================== CHEMISTRY - CLASS 12 ====================
  {
    id: 'chem-12-01',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 10,
    name: 'Solutions',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-01-t1', name: 'Henry’s law and Raoult’s law for ideal and non-ideal solutions', isCompleted: false },
      { id: 'chem-12-01-t2', name: 'Azeotropes (minimum and maximum boiling)', isCompleted: false },
      { id: 'chem-12-01-t3', name: 'Colligative properties: Relative lowering of vapor pressure, Elevation in boiling point', isCompleted: false },
      { id: 'chem-12-01-t4', name: 'Depression in freezing point and Osmotic pressure', isCompleted: false },
      { id: 'chem-12-01-t5', name: 'Abnormal molar mass and Van’t Hoff factor (i)', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-02',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 11,
    name: 'Electrochemistry',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-02-t1', name: 'Electrochemical cells, Galvanic cells and Nernst equation', isCompleted: false },
      { id: 'chem-12-02-t2', name: 'Relationship between cell potential, Gibbs energy and equilibrium constant', isCompleted: false },
      { id: 'chem-12-02-t3', name: 'Conductance in electrolytic solutions, Molar conductivity & Kohlrausch’s law', isCompleted: false },
      { id: 'chem-12-02-t4', name: 'Faraday’s laws of electrolysis and Batteries (Primary and Secondary cells)', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-03',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 12,
    name: 'Chemical Kinetics',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-03-t1', name: 'Rate of reaction, Factors influencing rate, Rate law and Order vs Molecularity', isCompleted: false },
      { id: 'chem-12-03-t2', name: 'Integrated rate equations for zero and first order reactions, Half-life', isCompleted: false },
      { id: 'chem-12-03-t3', name: 'Pseudo first order reactions', isCompleted: false },
      { id: 'chem-12-03-t4', name: 'Temperature dependence: Arrhenius equation and Activation energy', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-04',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 13,
    name: 'The d- and f-Block Elements',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-04-t1', name: 'Electronic configuration, Variable oxidation states, Colour, Catalytic properties', isCompleted: false },
      { id: 'chem-12-04-t2', name: 'Magnetic properties and formation of interstitial compounds/alloys', isCompleted: false },
      { id: 'chem-12-04-t3', name: 'Preparation, properties and oxidising action of K2Cr2O7 and KMnO4', isCompleted: false },
      { id: 'chem-12-04-t4', name: 'Lanthanoids: Electronic configuration, Oxidation states and Lanthanoid contraction', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-05',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 14,
    name: 'Coordination Compounds',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-05-t1', name: 'Werner’s theory, Ligands, Coordination number and IUPAC nomenclature', isCompleted: false },
      { id: 'chem-12-05-t2', name: 'Isomerism in coordination compounds (Geometrical, Optical, Structural)', isCompleted: false },
      { id: 'chem-12-05-t3', name: 'Valence Bond Theory and Crystal Field Theory (Octahedral & Tetrahedral)', isCompleted: false },
      { id: 'chem-12-05-t4', name: 'Spectrochemical series, Colour, Magnetic moment (spin-only)', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-06',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 15,
    name: 'Haloalkanes and Haloarenes',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-06-t1', name: 'Methods of preparation from alcohols, hydrocarbons and halogen exchange', isCompleted: false },
      { id: 'chem-12-06-t2', name: 'Mechanisms of SN1 and SN2 reactions with stereochemical aspects', isCompleted: false },
      { id: 'chem-12-06-t3', name: 'Elimination reactions (Saytzeff rule) and reactions with metals (Grignard)', isCompleted: false },
      { id: 'chem-12-06-t4', name: 'Haloarenes: Nucleophilic aromatic substitution inertness and electrophilic substitution', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-07',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 16,
    name: 'Alcohols, Phenols and Ethers',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-07-t1', name: 'Alcohols: Preparation, Hydroboration-oxidation, Acidity, Dehydration mechanism', isCompleted: false },
      { id: 'chem-12-07-t2', name: 'Lucas test, Victor Meyer test and Oxidation of 1°, 2°, 3° alcohols', isCompleted: false },
      { id: 'chem-12-07-t3', name: 'Phenols: Preparation from cumene, Acidity comparison with alcohols', isCompleted: false },
      { id: 'chem-12-07-t4', name: 'Named reactions: Reimer-Tiemann, Kolbe’s reaction, Oxidation with chromic acid', isCompleted: false },
      { id: 'chem-12-07-t5', name: 'Ethers: Williamson’s synthesis and Cleavage of C-O bond by HI', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-08',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 17,
    name: 'Aldehydes, Ketones and Carboxylic Acids',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-08-t1', name: 'Preparation of aldehydes and ketones (Rosenmund, Stephen, Etard, Gattermann-Koch)', isCompleted: false },
      { id: 'chem-12-08-t2', name: 'Nucleophilic addition reactions: Addition of HCN, NaHSO3, Grignard, Alcohols, Ammonia derivatives', isCompleted: false },
      { id: 'chem-12-08-t3', name: 'Distinction tests: Tollens, Fehling, Iodoform (haloform) reaction', isCompleted: false },
      { id: 'chem-12-08-t4', name: 'Aldol condensation, Cross aldol and Cannizzaro reaction mechanisms', isCompleted: false },
      { id: 'chem-12-08-t5', name: 'Carboxylic acids: Acidity and substituent effects, Hell-Volhard-Zelinsky (HVZ) reaction', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-09',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 18,
    name: 'Amines',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-09-t1', name: 'Preparation: Gabriel phthalimide synthesis, Hoffmann bromamide degradation', isCompleted: false },
      { id: 'chem-12-09-t2', name: 'Basicity of aliphatic vs aromatic amines in gas and aqueous phases', isCompleted: false },
      { id: 'chem-12-09-t3', name: 'Carbylamine test and Hinsberg test for distinction of amines', isCompleted: false },
      { id: 'chem-12-09-t4', name: 'Diazonium salts: Preparation, Sandmeyer, Gattermann and Coupling reactions', isCompleted: false }
    ]
  },
  {
    id: 'chem-12-10',
    subjectId: 'chemistry',
    classLevel: '12',
    order: 19,
    name: 'Biomolecules',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'chem-12-10-t1', name: 'Carbohydrates: Classification, Glucose structure & reactions, Glycosidic linkage', isCompleted: false },
      { id: 'chem-12-10-t2', name: 'Proteins: Amino acids, Peptide bond, Primary, secondary, tertiary & quaternary structures', isCompleted: false },
      { id: 'chem-12-10-t3', name: 'Denaturation of proteins and Enzymes overview', isCompleted: false },
      { id: 'chem-12-10-t4', name: 'Nucleic acids: DNA, RNA chemical composition, Double helix model and functions', isCompleted: false }
    ]
  },

  // ==================== BOTANY - CLASS 11 ====================
  {
    id: 'bot-11-01',
    subjectId: 'botany',
    classLevel: '11',
    order: 1,
    name: 'The Living World',
    status: 'not_started',
    priority: 'low',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-01-t1', name: 'What is living? Biodiversity, Need for classification', isCompleted: false },
      { id: 'bot-11-01-t2', name: 'Binomial nomenclature and rules (ICBN)', isCompleted: false },
      { id: 'bot-11-01-t3', name: 'Taxonomic categories: Species, Genus, Family, Order, Class, Phylum/Division, Kingdom', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-02',
    subjectId: 'botany',
    classLevel: '11',
    order: 2,
    name: 'Biological Classification',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-02-t1', name: 'Five Kingdom classification by Whittaker', isCompleted: false },
      { id: 'bot-11-02-t2', name: 'Kingdom Monera: Archaebacteria, Eubacteria (Cyanobacteria, Mycoplasma)', isCompleted: false },
      { id: 'bot-11-02-t3', name: 'Kingdom Protista: Chrysophytes, Dinoflagellates, Euglenoids, Slime moulds, Protozoans', isCompleted: false },
      { id: 'bot-11-02-t4', name: 'Kingdom Fungi: Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes', isCompleted: false },
      { id: 'bot-11-02-t5', name: 'Viruses, Viroids, Prions and Lichens', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-03',
    subjectId: 'botany',
    classLevel: '11',
    order: 3,
    name: 'Plant Kingdom',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-03-t1', name: 'Algae: Chlorophyceae, Phaeophyceae, Rhodophyceae pigments & storage foods', isCompleted: false },
      { id: 'bot-11-03-t2', name: 'Bryophytes: Liverworts and Mosses life cycle', isCompleted: false },
      { id: 'bot-11-03-t3', name: 'Pteridophytes: Homosporous & Heterosporous, Prothallus, Stelar organization', isCompleted: false },
      { id: 'bot-11-03-t4', name: 'Gymnosperms: Naked seeds, Cones, Cycas and Pinus life cycles', isCompleted: false },
      { id: 'bot-11-03-t5', name: 'Angiosperms overview and Alternation of generations', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-04',
    subjectId: 'botany',
    classLevel: '11',
    order: 4,
    name: 'Morphology of Flowering Plants',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-04-t1', name: 'Root, Stem, Leaf modifications and venation', isCompleted: false },
      { id: 'bot-11-04-t2', name: 'Inflorescence: Racemose and Cymose', isCompleted: false },
      { id: 'bot-11-04-t3', name: 'Flower structure: Aestivation, Placentation and symmetry', isCompleted: false },
      { id: 'bot-11-04-t4', name: 'Fruit and Seed structure, Description of Families (Fabaceae, Solanaceae, Malvaceae, etc.)', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-05',
    subjectId: 'botany',
    classLevel: '11',
    order: 5,
    name: 'Anatomy of Flowering Plants',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-05-t1', name: 'Meristematic and permanent tissues (Parenchyma, Collenchyma, Sclerenchyma)', isCompleted: false },
      { id: 'bot-11-05-t2', name: 'Complex tissues: Xylem and Phloem elements', isCompleted: false },
      { id: 'bot-11-05-t3', name: 'Tissue systems: Epidermal, Ground, and Vascular bundles (Radial, Conjoint)', isCompleted: false },
      { id: 'bot-11-05-t4', name: 'Internal structure of Dicot and Monocot Root, Stem, and Leaf', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-06',
    subjectId: 'botany',
    classLevel: '11',
    order: 6,
    name: 'Cell: The Unit of Life',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-06-t1', name: 'Cell theory, Prokaryotic vs Eukaryotic cell organization', isCompleted: false },
      { id: 'bot-11-06-t2', name: 'Plasma membrane (Fluid Mosaic Model) and Cell wall', isCompleted: false },
      { id: 'bot-11-06-t3', name: 'Endomembrane system: ER, Golgi apparatus, Lysosomes, Vacuoles', isCompleted: false },
      { id: 'bot-11-06-t4', name: 'Mitochondria, Plastids (Chloroplasts), Ribosomes, Cytoskeleton', isCompleted: false },
      { id: 'bot-11-06-t5', name: 'Nucleus, Chromatin, Chromosomes and types based on centromere', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-07',
    subjectId: 'botany',
    classLevel: '11',
    order: 7,
    name: 'Cell Cycle and Cell Division',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-07-t1', name: 'Cell cycle phases: G1, S, G2, M phase and G0 quiescence', isCompleted: false },
      { id: 'bot-11-07-t2', name: 'Mitosis: Prophase, Metaphase, Anaphase, Telophase & Cytokinesis', isCompleted: false },
      { id: 'bot-11-07-t3', name: 'Meiosis I: Detailed stages of Prophase I (Leptotene to Diakinesis)', isCompleted: false },
      { id: 'bot-11-07-t4', name: 'Meiosis II and significance of meiosis (Crossing over & Variation)', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-08',
    subjectId: 'botany',
    classLevel: '11',
    order: 8,
    name: 'Photosynthesis in Higher Plants',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-08-t1', name: 'Photosynthetic pigments, Absorption and action spectra', isCompleted: false },
      { id: 'bot-11-08-t2', name: 'Light reaction: Photophosphorylation (Cyclic & Non-cyclic / Z-scheme)', isCompleted: false },
      { id: 'bot-11-08-t3', name: 'Chemiosmotic hypothesis and ATP synthesis in chloroplasts', isCompleted: false },
      { id: 'bot-11-08-t4', name: 'Dark reaction: Calvin cycle (C3 pathway) and RuBisCO role', isCompleted: false },
      { id: 'bot-11-08-t5', name: 'C4 pathway (Kranz anatomy) and Photorespiration', isCompleted: false },
      { id: 'bot-11-08-t6', name: 'Factors affecting photosynthesis: Blackman’s law of limiting factors', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-09',
    subjectId: 'botany',
    classLevel: '11',
    order: 9,
    name: 'Respiration in Plants',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-09-t1', name: 'Cellular respiration, Glycolysis (EMP pathway) steps and ATP yield', isCompleted: false },
      { id: 'bot-11-09-t2', name: 'Fermentation (Lactic acid and Alcoholic)', isCompleted: false },
      { id: 'bot-11-09-t3', name: 'Aerobic respiration: Link reaction & Krebs cycle (TCA cycle)', isCompleted: false },
      { id: 'bot-11-09-t4', name: 'Electron Transport System (ETS), Oxidative phosphorylation & ATP balance sheet', isCompleted: false },
      { id: 'bot-11-09-t5', name: 'Amphibolic pathway and Respiratory Quotient (RQ)', isCompleted: false }
    ]
  },
  {
    id: 'bot-11-10',
    subjectId: 'botany',
    classLevel: '11',
    order: 10,
    name: 'Plant Growth and Development',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-11-10-t1', name: 'Phases of plant growth, Growth rate (Arithmetic & Geometric)', isCompleted: false },
      { id: 'bot-11-10-t2', name: 'Differentiation, dedifferentiation, and redifferentiation', isCompleted: false },
      { id: 'bot-11-10-t3', name: 'Plant Growth Regulators: Auxins, Gibberellins, Cytokinins physiological effects', isCompleted: false },
      { id: 'bot-11-10-t4', name: 'Ethylene and Abscisic acid (ABA)', isCompleted: false }
    ]
  },

  // ==================== BOTANY - CLASS 12 ====================
  {
    id: 'bot-12-01',
    subjectId: 'botany',
    classLevel: '12',
    order: 11,
    name: 'Sexual Reproduction in Flowering Plants',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-01-t1', name: 'Microsporogenesis, Pollen grain structure and viability', isCompleted: false },
      { id: 'bot-12-01-t2', name: 'Megasporogenesis and 7-celled 8-nucleate embryo sac structure', isCompleted: false },
      { id: 'bot-12-01-t3', name: 'Pollination types: Autogamy, Geitonogamy, Xenogamy and biotic/abiotic agents', isCompleted: false },
      { id: 'bot-12-01-t4', name: 'Outbreeding devices and Pollen-pistil interaction', isCompleted: false },
      { id: 'bot-12-01-t5', name: 'Double fertilization: Syngamy and Triple fusion', isCompleted: false },
      { id: 'bot-12-01-t6', name: 'Post-fertilization events: Endosperm, Embryo development, Apomixis and Polyembryony', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-02',
    subjectId: 'botany',
    classLevel: '12',
    order: 12,
    name: 'Principles of Inheritance and Variation',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-02-t1', name: 'Mendelian inheritance: Monohybrid cross, Law of Segregation and Dominance', isCompleted: false },
      { id: 'bot-12-02-t2', name: 'Incomplete dominance, Co-dominance (ABO blood grouping)', isCompleted: false },
      { id: 'bot-12-02-t3', name: 'Dihybrid cross and Law of Independent Assortment', isCompleted: false },
      { id: 'bot-12-02-t4', name: 'Chromosomal theory of inheritance, Linkage and Recombination (Morgan)', isCompleted: false },
      { id: 'bot-12-02-t5', name: 'Sex determination in humans, birds and honey bees', isCompleted: false },
      { id: 'bot-12-02-t6', name: 'Mendelian and Chromosomal disorders: Thalassemia, Haemophilia, Down syndrome, Turner, Klinefelter', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-03',
    subjectId: 'botany',
    classLevel: '12',
    order: 13,
    name: 'Molecular Basis of Inheritance',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-03-t1', name: 'DNA as genetic material: Griffith, Avery-MacLeod-McCarty, Hershey-Chase experiments', isCompleted: false },
      { id: 'bot-12-03-t2', name: 'Structure of DNA & RNA, Packaging of DNA (Nucleosome model)', isCompleted: false },
      { id: 'bot-12-03-t3', name: 'DNA replication: Semiconservative replication (Meselson-Stahl experiment) and enzymes', isCompleted: false },
      { id: 'bot-12-03-t4', name: 'Transcription in prokaryotes and eukaryotes, RNA processing (capping, tailing, splicing)', isCompleted: false },
      { id: 'bot-12-03-t5', name: 'Genetic code features and wobble hypothesis', isCompleted: false },
      { id: 'bot-12-03-t6', name: 'Translation mechanism and Regulation of gene expression: Lac Operon', isCompleted: false },
      { id: 'bot-12-03-t7', name: 'Human Genome Project (HGP) and DNA fingerprinting', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-04',
    subjectId: 'botany',
    classLevel: '12',
    order: 14,
    name: 'Microbes in Human Welfare',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-04-t1', name: 'Microbes in household food processing (LAB, baker’s yeast, cheese)', isCompleted: false },
      { id: 'bot-12-04-t2', name: 'Microbes in industrial products: Antibiotics, organic acids, enzymes, statins, cyclosporin A', isCompleted: false },
      { id: 'bot-12-04-t3', name: 'Microbes in sewage treatment (STP: Primary & Secondary BOD)', isCompleted: false },
      { id: 'bot-12-04-t4', name: 'Microbes in biogas production, as biocontrol agents and biofertilizers', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-05',
    subjectId: 'botany',
    classLevel: '12',
    order: 15,
    name: 'Organisms and Populations',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-05-t1', name: 'Population attributes: Birth rate, Death rate, Sex ratio, Age pyramids', isCompleted: false },
      { id: 'bot-12-05-t2', name: 'Population growth models: Exponential and Logistic growth (Verhulst-Pearl equation)', isCompleted: false },
      { id: 'bot-12-05-t3', name: 'Population interactions: Mutualism, Competition (Gause’s exclusion), Predation, Parasitism, Commensalism, Amensalism', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-06',
    subjectId: 'botany',
    classLevel: '12',
    order: 16,
    name: 'Ecosystem',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-06-t1', name: 'Ecosystem structure and functions, Primary and Secondary productivity', isCompleted: false },
      { id: 'bot-12-06-t2', name: 'Decomposition process and limiting factors', isCompleted: false },
      { id: 'bot-12-06-t3', name: 'Energy flow: Food chains, Food webs, 10% law of energy transfer', isCompleted: false },
      { id: 'bot-12-06-t4', name: 'Ecological pyramids (Pyramids of number, biomass, and energy)', isCompleted: false }
    ]
  },
  {
    id: 'bot-12-07',
    subjectId: 'botany',
    classLevel: '12',
    order: 17,
    name: 'Biodiversity and its Conservation',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'bot-12-07-t1', name: 'Levels of biodiversity (Genetic, Species, Ecological)', isCompleted: false },
      { id: 'bot-12-07-t2', name: 'Patterns of biodiversity: Latitudinal gradient and Species-Area relationship (Alexander von Humboldt)', isCompleted: false },
      { id: 'bot-12-07-t3', name: 'Loss of biodiversity: The "Evil Quartet"', isCompleted: false },
      { id: 'bot-12-07-t4', name: 'In-situ and Ex-situ conservation strategies, Biosphere reserves, National parks, Sacred groves', isCompleted: false }
    ]
  },

  // ==================== ZOOLOGY - CLASS 11 ====================
  {
    id: 'zoo-11-01',
    subjectId: 'zoology',
    classLevel: '11',
    order: 1,
    name: 'Animal Kingdom',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-01-t1', name: 'Basis of classification: Symmetry, Coelom, Segmentation, Notochord', isCompleted: false },
      { id: 'zoo-11-01-t2', name: 'Non-chordates: Porifera, Coelenterata, Ctenophora, Platyhelminthes, Aschelminthes', isCompleted: false },
      { id: 'zoo-11-01-t3', name: 'Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata', isCompleted: false },
      { id: 'zoo-11-01-t4', name: 'Chordates: Urochordata, Cephalochordata, Vertebrata', isCompleted: false },
      { id: 'zoo-11-01-t5', name: 'Vertebrata classes: Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-02',
    subjectId: 'zoology',
    classLevel: '11',
    order: 2,
    name: 'Structural Organisation in Animals',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-02-t1', name: 'Epithelial tissues (Squamous, Cuboidal, Columnar, Ciliated) and cell junctions', isCompleted: false },
      { id: 'zoo-11-02-t2', name: 'Connective tissues (Areolar, Adipose, Dense regular/irregular, Cartilage, Bone, Blood)', isCompleted: false },
      { id: 'zoo-11-02-t3', name: 'Muscle and Neural tissues', isCompleted: false },
      { id: 'zoo-11-02-t4', name: 'Morphology and anatomy of Frog (Rana tigrina) as per revised syllabus', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-03',
    subjectId: 'zoology',
    classLevel: '11',
    order: 3,
    name: 'Breathing and Exchange of Gases',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-03-t1', name: 'Respiratory system in humans and mechanism of breathing', isCompleted: false },
      { id: 'zoo-11-03-t2', name: 'Respiratory volumes and capacities (TV, IRV, ERV, RV, VC, TLC)', isCompleted: false },
      { id: 'zoo-11-03-t3', name: 'Exchange of gases at alveoli and tissues (pO2 and pCO2 gradients)', isCompleted: false },
      { id: 'zoo-11-03-t4', name: 'Transport of oxygen: Oxygen dissociation curve, Bohr effect', isCompleted: false },
      { id: 'zoo-11-03-t5', name: 'Transport of carbon dioxide and Haldane effect', isCompleted: false },
      { id: 'zoo-11-03-t6', name: 'Regulation of respiration and disorders: Asthma, Emphysema, Occupational disorders', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-04',
    subjectId: 'zoology',
    classLevel: '11',
    order: 4,
    name: 'Body Fluids and Circulation',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-04-t1', name: 'Blood composition: Formed elements, Plasma, ABO & Rh grouping, Erythroblastosis foetalis', isCompleted: false },
      { id: 'zoo-11-04-t2', name: 'Coagulation of blood cascade mechanism and Lymph (tissue fluid)', isCompleted: false },
      { id: 'zoo-11-04-t3', name: 'Human circulatory system: Heart anatomy, Conducting system (SA & AV node)', isCompleted: false },
      { id: 'zoo-11-04-t4', name: 'Cardiac cycle, Heart sounds, Cardiac output (Stroke volume)', isCompleted: false },
      { id: 'zoo-11-04-t5', name: 'Electrocardiogram (ECG) waves interpretation (P, QRS, T)', isCompleted: false },
      { id: 'zoo-11-04-t6', name: 'Double circulation and disorders (Hypertension, CAD, Angina, Heart failure)', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-05',
    subjectId: 'zoology',
    classLevel: '11',
    order: 5,
    name: 'Excretory Products and their Elimination',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-05-t1', name: 'Modes of excretion: Ammonotelism, Ureotelism, Uricotelism', isCompleted: false },
      { id: 'zoo-11-05-t2', name: 'Human excretory system: Kidney anatomy and Nephron structure', isCompleted: false },
      { id: 'zoo-11-05-t3', name: 'Urine formation: Glomerular filtration (GFR), Tubular reabsorption, Secretion', isCompleted: false },
      { id: 'zoo-11-05-t4', name: 'Counter-current mechanism in Henle’s loop and vasa recta', isCompleted: false },
      { id: 'zoo-11-05-t5', name: 'Regulation of kidney function: RAAS mechanism, ADH (vasopressin), ANF', isCompleted: false },
      { id: 'zoo-11-05-t6', name: 'Micturition and disorders: Uremia, Renal calculi, Glomerulonephritis, Dialysis', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-06',
    subjectId: 'zoology',
    classLevel: '11',
    order: 6,
    name: 'Locomotion and Movement',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-06-t1', name: 'Types of movement: Amoeboid, Ciliary, Flagellar, Muscular', isCompleted: false },
      { id: 'zoo-11-06-t2', name: 'Skeletal muscle structure: Sarcomere, Actin and Myosin filaments', isCompleted: false },
      { id: 'zoo-11-06-t3', name: 'Mechanism of muscle contraction: Sliding filament theory', isCompleted: false },
      { id: 'zoo-11-06-t4', name: 'Skeletal system: Axial and Appendicular skeleton bone counts', isCompleted: false },
      { id: 'zoo-11-06-t5', name: 'Types of joints: Fibrous, Cartilaginous, Synovial', isCompleted: false },
      { id: 'zoo-11-06-t6', name: 'Disorders: Myasthenia gravis, Tetany, Muscular dystrophy, Arthritis, Osteoporosis, Gout', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-07',
    subjectId: 'zoology',
    classLevel: '11',
    order: 7,
    name: 'Neural Control and Coordination',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-07-t1', name: 'Neuron structure: Dendrites, Axon, Myelin sheath', isCompleted: false },
      { id: 'zoo-11-07-t2', name: 'Generation and conduction of nerve impulse (Resting potential, Action potential)', isCompleted: false },
      { id: 'zoo-11-07-t3', name: 'Synaptic transmission: Chemical synapse and neurotransmitters', isCompleted: false },
      { id: 'zoo-11-07-t4', name: 'Central nervous system: Forebrain, Midbrain, Hindbrain functions', isCompleted: false }
    ]
  },
  {
    id: 'zoo-11-08',
    subjectId: 'zoology',
    classLevel: '11',
    order: 8,
    name: 'Chemical Coordination and Integration',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-11-08-t1', name: 'Endocrine glands and hormone classification', isCompleted: false },
      { id: 'zoo-11-08-t2', name: 'Hypothalamus and Pituitary gland hormones and disorders (Gigantism, Dwarfism, Acromegaly)', isCompleted: false },
      { id: 'zoo-11-08-t3', name: 'Thyroid, Parathyroid, Adrenal gland hormones and disorders', isCompleted: false },
      { id: 'zoo-11-08-t4', name: 'Pancreas (Insulin, Glucagon), Gonads (Testes, Ovaries hormones)', isCompleted: false },
      { id: 'zoo-11-08-t5', name: 'Mechanism of hormone action: Protein hormones (secondary messengers) vs Steroid hormones', isCompleted: false }
    ]
  },

  // ==================== ZOOLOGY - CLASS 12 ====================
  {
    id: 'zoo-12-01',
    subjectId: 'zoology',
    classLevel: '12',
    order: 9,
    name: 'Human Reproduction',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-01-t1', name: 'Male reproductive system: Testes, Seminiferous tubules, Leydig cells, Sertoli cells', isCompleted: false },
      { id: 'zoo-12-01-t2', name: 'Female reproductive system: Ovaries, Fallopian tubes, Uterus, Mammary glands', isCompleted: false },
      { id: 'zoo-12-01-t3', name: 'Spermatogenesis and Oogenesis comparison', isCompleted: false },
      { id: 'zoo-12-01-t4', name: 'Menstrual cycle phases: Menstrual, Follicular, Ovulatory, Luteal hormonal changes', isCompleted: false },
      { id: 'zoo-12-01-t5', name: 'Fertilization, Cortical reaction, Cleavage and Blastocyst implantation', isCompleted: false },
      { id: 'zoo-12-01-t6', name: 'Pregnancy, Placenta as endocrine tissue, Parturition and Lactation', isCompleted: false }
    ]
  },
  {
    id: 'zoo-12-02',
    subjectId: 'zoology',
    classLevel: '12',
    order: 10,
    name: 'Reproductive Health',
    status: 'not_started',
    priority: 'medium',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-02-t1', name: 'Population stabilization and contraceptive methods (Natural, Barrier, IUDs, Oral pills, Surgical)', isCompleted: false },
      { id: 'zoo-12-02-t2', name: 'Medical Termination of Pregnancy (MTP) conditions', isCompleted: false },
      { id: 'zoo-12-02-t3', name: 'Sexually Transmitted Infections (STIs) and prevention', isCompleted: false },
      { id: 'zoo-12-02-t4', name: 'Infertility and Assisted Reproductive Technologies (ART: IVF, ZIFT, GIFT, ICSI, IUI)', isCompleted: false }
    ]
  },
  {
    id: 'zoo-12-03',
    subjectId: 'zoology',
    classLevel: '12',
    order: 11,
    name: 'Evolution',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-03-t1', name: 'Origin of life: Oparin-Haldane hypothesis, Miller-Urey experiment', isCompleted: false },
      { id: 'zoo-12-03-t2', name: 'Evidences of evolution: Homologous vs Analogous organs, Embryological, Paleontological', isCompleted: false },
      { id: 'zoo-12-03-t3', name: 'Adaptive radiation (Darwin’s finches, Australian marsupials)', isCompleted: false },
      { id: 'zoo-12-03-t4', name: 'Theories of evolution: Lamarckism, Darwinian natural selection, Mutation theory (Hugo de Vries)', isCompleted: false },
      { id: 'zoo-12-03-t5', name: 'Hardy-Weinberg equilibrium principle (p2 + 2pq + q2 = 1) and factors disturbing it', isCompleted: false },
      { id: 'zoo-12-03-t6', name: 'Brief account of evolution and human evolutionary timeline (Australopithecus to Homo sapiens)', isCompleted: false }
    ]
  },
  {
    id: 'zoo-12-04',
    subjectId: 'zoology',
    classLevel: '12',
    order: 12,
    name: 'Human Health and Disease',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-04-t1', name: 'Common pathogens and human diseases: Typhoid, Pneumonia, Common cold, Malaria, Amoebiasis, Ascariasis, Filariasis, Ringworm', isCompleted: false },
      { id: 'zoo-12-04-t2', name: 'Immunity: Innate immunity barriers and Acquired immunity (Humoral vs Cell-mediated)', isCompleted: false },
      { id: 'zoo-12-04-t3', name: 'Antibody structure, Active and passive immunity, Vaccination and Allergies', isCompleted: false },
      { id: 'zoo-12-04-t4', name: 'Autoimmunity and Immune system lymphoid organs (Primary and Secondary)', isCompleted: false },
      { id: 'zoo-12-04-t5', name: 'AIDS: Causative agent HIV, Transmission, Life cycle in macrophages & CD4+ T cells, Diagnosis (ELISA)', isCompleted: false },
      { id: 'zoo-12-04-t6', name: 'Cancer: Benign vs Malignant, Causes, Oncogenes, Detection and Treatments', isCompleted: false },
      { id: 'zoo-12-04-t7', name: 'Drugs and Alcohol abuse: Opioids, Cannabinoids, Coca alkaloids and withdrawal symptoms', isCompleted: false }
    ]
  },
  {
    id: 'zoo-12-05',
    subjectId: 'zoology',
    classLevel: '12',
    order: 13,
    name: 'Biotechnology: Principles and Processes',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-05-t1', name: 'Recombinant DNA technology tools: Restriction enzymes (Endonucleases, sticky ends)', isCompleted: false },
      { id: 'zoo-12-05-t2', name: 'Cloning vectors: Origin of replication (ori), Selectable markers (pBR322 ampR & tetR), Insertional inactivation', isCompleted: false },
      { id: 'zoo-12-05-t3', name: 'Competent host transformation methods (Heat shock, Micro-injection, Biolistics/Gene gun)', isCompleted: false },
      { id: 'zoo-12-05-t4', name: 'Processes of r-DNA technology: Isolation of DNA, Gel electrophoresis, PCR (Denaturation, Annealing, Extension)', isCompleted: false },
      { id: 'zoo-12-05-t5', name: 'Bioreactors (Simple stirred and Sparged) and Downstream processing', isCompleted: false }
    ]
  },
  {
    id: 'zoo-12-06',
    subjectId: 'zoology',
    classLevel: '12',
    order: 14,
    name: 'Biotechnology and its Applications',
    status: 'not_started',
    priority: 'high',
    mcqCount: 0,
    correctMcqs: 0,
    pyqCount: 0,
    masteryPercentage: 0,
    isVerifiedNmcSyllabus: true,
    topics: [
      { id: 'zoo-12-06-t1', name: 'Applications in agriculture: Bt cotton (Cry toxins, Bacillus thuringiensis)', isCompleted: false },
      { id: 'zoo-12-06-t2', name: 'RNA interference (RNAi) in tobacco against Meloidogyne incognita', isCompleted: false },
      { id: 'zoo-12-06-t3', name: 'Applications in medicine: Genetically engineered insulin (Humulin creation by Eli Lilly)', isCompleted: false },
      { id: 'zoo-12-06-t4', name: 'Gene therapy: ADA deficiency treatment using retroviral vector', isCompleted: false },
      { id: 'zoo-12-06-t5', name: 'Molecular diagnosis (PCR, ELISA) and Transgenic animals benefits (Rosie cow)', isCompleted: false },
      { id: 'zoo-12-06-t6', name: 'Ethical issues, GEAC role, and Biopiracy (Basmati rice case)', isCompleted: false }
    ]
  }
];
