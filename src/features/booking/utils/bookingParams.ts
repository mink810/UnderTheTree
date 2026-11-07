/** 예약 수정 플로우에서 일정 정보를 유지하기 위한 공통 params */
export type BookingScheduleParams = {
  date?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: string;
  price?: string;
};

export function pickScheduleParams(
  params: Record<string, string | undefined>
): BookingScheduleParams {
  return {
    date: params.date,
    startTime: params.startTime,
    endTime: params.endTime,
    durationMinutes: params.durationMinutes,
    price: params.price,
  };
}

export function scheduleParamsToRecord(
  schedule: BookingScheduleParams
): Record<string, string> {
  const record: Record<string, string> = {};

  if (schedule.date) {
    record.date = schedule.date;
  }
  if (schedule.startTime) {
    record.startTime = schedule.startTime;
  }
  if (schedule.endTime) {
    record.endTime = schedule.endTime;
  }
  if (schedule.durationMinutes) {
    record.durationMinutes = schedule.durationMinutes;
  }
  if (schedule.price) {
    record.price = schedule.price;
  }

  return record;
}
