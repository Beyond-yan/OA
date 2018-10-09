package com.gdssoft.oa.dao.meetingTimes;

import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.meetingTimes.MeetingTimes;

public interface MeetingTimesDao extends BaseDao<MeetingTimes>{
	public List<MeetingTimes> getByCondition(String year, String times, String type);
	public int setTimes(String archivesId, String timesId, String times);
	public int setTimesAndNo(String archivesId, String num, String timesId, String times);
	public int setNumber(String archivesId, String number);
}
