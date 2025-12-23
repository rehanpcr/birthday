import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }} // Durasi animasi 1 detik
      className="full-screen flex-center"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;