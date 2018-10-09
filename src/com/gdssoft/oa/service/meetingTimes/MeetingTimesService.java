package com.gdssoft.oa.service.meetingTimes;

import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.meetingTimes.MeetingTimes;

public interface MeetingTimesService extends BaseService<MeetingTimes> {
	public List<MeetingTimes> getByCondition(String year, String times, String type);
	public int setTimes(String archivesId, String timesId, String times);
	public int setTimesAndNo(String archivesId, String num, String timesId, String times);
	public int setNumber(String archivesId, String number);
}
