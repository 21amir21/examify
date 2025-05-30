// import React from "react";
// import StudentMediaVideo from "./StudentMediaVideo";

// interface StudentsMediaVideoListProps {
//   studentStreams: Map<string, MediaStream>;
// }

// const StudentsMediaVideoList: React.FC<StudentsMediaVideoListProps> = ({
//   studentStreams,
// }) => {
//   const studentStreamsKeys = Array.from(studentStreams.keys());

//   return (
//     <ul className="flex justify-center items-center">
//       {studentStreamsKeys.map((studentUsername) => (
//         <StudentMediaVideo
//           key={studentUsername}
//           studentStream={studentStreams.get(studentUsername)!}
//           studentUsername={studentUsername}
//         />
//       ))}
//     </ul>
//   );
// };

// export default StudentsMediaVideoList;

import React from "react";
import StudentMediaVideo from "./StudentMediaVideo";

interface StudentsMediaVideoListProps {
  studentStreams: Map<string, MediaStream>;
}

const StudentsMediaVideoList: React.FC<StudentsMediaVideoListProps> = ({
  studentStreams,
}) => {
  const studentUsernames = Array.from(studentStreams.keys());

  return (
    <ul className="flex justify-center items-center flex-wrap gap-4">
      {studentUsernames.map((studentUsername) => (
        <StudentMediaVideo
          key={studentUsername}
          studentStream={studentStreams.get(studentUsername) ?? null}
          studentUsername={studentUsername}
        />
      ))}
    </ul>
  );
};

export default StudentsMediaVideoList;
