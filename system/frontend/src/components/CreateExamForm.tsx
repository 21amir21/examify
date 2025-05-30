import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStopwatch } from "react-timer-hook";
import { Modal } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../hooks/http";
import AuthContext from "../store/auth/AuthContext";
import Spinner from "./ui/Spinner";

type FormData = {
  courseNameCode: string;
  name: string;
  duration: number;
  startDate: string;
  startTime: string;
  instanceTemplateName: string;
};

type Course = {
  _id: string;
  code: string;
  name: string;
};

type InstanceTemplate = {
  _id: string;
  name: string;
  description: string;
};

const parseDateTime = (date: string, time: string): string => {
  const [hh, mm] = time.split(":");
  const dateTime = new Date(date + "T00:00");
  dateTime.setHours(Number(hh));
  dateTime.setMinutes(Number(mm));
  return dateTime.toISOString();
};

const formatNumberTwoDigits = (number: number) =>
  number.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
  });

export default function CreateExamForm() {
  const [instanceTemplates, setInstanceTemplates] = useState<
    InstanceTemplate[]
  >([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instanceTemplateInfo, setInstanceTemplateInfo] = useState<string>("");
  const [isCreatingInstance, setIsCreatingInstance] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { seconds, minutes, start, reset } = useStopwatch({ autoStart: false });

  const { isLoading, errorTitle, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const authCTX = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instanceRes, courseRes] = await Promise.all([
          sendRequest("http://localhost:8080/instance-templates", "GET"),
          sendRequest(
            `http://localhost:8080/instructor/courses?username=${authCTX.username}`,
            "GET"
          ),
        ]);
        setInstanceTemplates(instanceRes.instanceTemplates);
        setCourses(courseRes.assignedCourses);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInstanceTemplateChange = (value: string) => {
    const selected = instanceTemplates.find((t) => t.name === value);
    setInstanceTemplateInfo(selected?.description || "");
  };

  const onSubmit = async (formData: FormData) => {
    const course = JSON.parse(formData.courseNameCode);
    const { name, duration, startDate, startTime, instanceTemplateName } =
      formData;
    const startDateTime = parseDateTime(startDate, startTime);

    try {
      setIsCreatingInstance(true);
      start();
      const response = await sendRequest(
        "http://localhost:8080/exam-management/create-exam",
        "POST",
        JSON.stringify({
          name,
          duration,
          startDateTime,
          courseCode: course.code,
          courseName: course.name,
          instanceTemplateName,
          instructorID: authCTX.id,
        }),
        { "Content-Type": "application/json" }
      );
      setIsCreatingInstance(false);
      reset();
      if (!response.error) {
        navigate("/instructors/exams");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {!isLoading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-2xl mx-auto"
        >
          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">Course</label>
            <select
              {...register("courseNameCode", {
                required: true,
                validate: (v) => v !== "default",
              })}
              className="w-full rounded-full px-4 py-2"
              defaultValue="default"
            >
              <option disabled value="default">
                Select a course
              </option>
              {courses.map((c) => (
                <option
                  key={c._id}
                  value={JSON.stringify({ code: c.code, name: c.name })}
                >
                  {`${c.code} - ${c.name}`}
                </option>
              ))}
            </select>
            {errors.courseNameCode && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Course name must be selected
              </p>
            )}
          </div>

          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">Exam Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full rounded-full px-4 py-2"
            />
            {errors.name && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Exam name cannot be empty
              </p>
            )}
          </div>

          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">
              Exam Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              {...register("duration", { required: true, min: 15 })}
              className="w-full rounded-full px-4 py-2"
            />
            {errors.duration && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Duration must be at least 15 minutes
              </p>
            )}
          </div>

          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">Start Date</label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full rounded-full px-4 py-2"
            />
            {errors.startDate && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Start date must not be empty
              </p>
            )}
          </div>

          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">Start Time</label>
            <input
              type="time"
              {...register("startTime", { required: true })}
              className="w-full rounded-full px-4 py-2"
            />
            {errors.startTime && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Start time must not be empty
              </p>
            )}
          </div>

          <div className="w-full my-4 flex flex-col items-center">
            <label className="font-bold text-white mb-2">
              Instance Template
            </label>
            <select
              {...register("instanceTemplateName", {
                required: true,
                validate: (v) => v !== "default",
                onChange: (e) => onInstanceTemplateChange(e.target.value),
              })}
              className="w-full rounded-full px-4 py-2"
              defaultValue="default"
            >
              <option disabled value="default">
                Select an instance template
              </option>
              {instanceTemplates.map((template) => (
                <option key={template._id} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
            <textarea
              value={instanceTemplateInfo}
              readOnly
              placeholder="Instance template description..."
              className="w-full rounded-3xl mt-3 bg-gray-200 px-4 py-2 h-32 resize-none text-sm"
            />
            {errors.instanceTemplateName && (
              <p className="text-white font-bold mt-2 bg-black/70 rounded-full px-4 py-2 text-center w-full">
                Instance template must not be empty
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 rounded-full bg-white px-8 py-3 font-bold shadow-lg hover:scale-110 transition-transform"
          >
            Create
          </button>
        </form>
      )}

      <Modal open={!!errorTitle} onClose={clearError}>
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-40">
          <h2 className="text-xl font-bold">{errorTitle}</h2>
          <p className="mt-4">{errorDetails?.[0]}</p>
          <div className="mt-6 text-right">
            <button
              onClick={clearError}
              className="text-blue-500 font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={isLoading}>
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-40 text-center">
          {isCreatingInstance && (
            <>
              <p className="mb-4">
                Creating the exam network infrastructure may take up to 40
                seconds.
              </p>
              <Spinner />
              <p className="mt-4">Elapsed Time</p>
              <p className="font-bold text-lg">
                {`${formatNumberTwoDigits(minutes)}:${formatNumberTwoDigits(
                  seconds
                )}`}
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
