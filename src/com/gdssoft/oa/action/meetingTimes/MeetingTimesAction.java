package com.gdssoft.oa.action.meetingTimes;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.meetingTimes.MeetingTimes;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.meetingTimes.MeetingTimesService;

import flexjson.JSONSerializer;

public class MeetingTimesAction extends BaseAction{
	@Resource
	private MeetingTimesService meetingTimesService;
	
	public String save() {
		String year = getRequest().getParameter("year");
		String times = getRequest().getParameter("times");
		String type = getRequest().getParameter("type");
		List<MeetingTimes> meetingTimesList = meetingTimesService.getByCondition(year, times, type);
		if(meetingTimesList.size() > 0){
			setJsonString("{success:true,code:0,msg:\"期数已存在\"}");
		}else{
			MeetingTimes meetingTimes = new MeetingTimes();
			meetingTimes.setYear(Long.parseLong(year));
			meetingTimes.setTimes(Long.parseLong(times));
			meetingTimes.setType(Long.parseLong(type));
			meetingTimes = meetingTimesService.save(meetingTimes);
			setJsonString("{success:true,code:1,timesId:" + meetingTimes.getTimesId()
					+ "}");
		}
		return SUCCESS;
	}
	
	public String setTimes() {
		String archivesIds = getRequest().getParameter("archivesIds");
		String timesId = getRequest().getParameter("timesId");
		String times = getRequest().getParameter("timesl");
		String [] ids = archivesIds.split(",");
		for(int i = 0; i < ids.length; i++){
			String id = ids[i];
			meetingTimesService.setTimes(id, timesId, times);
		}
		setJsonString("{success:true,code:1,timesId:" + timesId + ",archivesIds:\"" + archivesIds
				+ "\"}");
		return SUCCESS;
	}

	public String setTimesAndNo() {
		String archivesId = getRequest().getParameter("archivesId");
		String num = getRequest().getParameter("num");
		String timesId = getRequest().getParameter("timesId");
		String times = getRequest().getParameter("timesl");
		meetingTimesService.setTimesAndNo(archivesId, num,timesId, times);
		setJsonString("{success:true,code:1,timesId:" + timesId + ",archivesId:\"" + archivesId
				+ "\"}");
		return SUCCESS;
	}

	public String setNumber() {
		String archivesId = getRequest().getParameter("archivesId");
		String number = getRequest().getParameter("number");
		meetingTimesService.setNumber(archivesId, number);
		setJsonString("{success:true,code:1,number:\"" + number + "\",archivesId:\"" + archivesId
				+ "\"}");
		return SUCCESS;
	}
	
	public String getByType() {
		String type = getRequest().getParameter("type");
		List<MeetingTimes> meetingTimesList = meetingTimesService.getByCondition(null,null,type);
		StringBuffer buff = new StringBuffer("[");
		for (MeetingTimes meetingTimes : meetingTimesList) {
			buff.append("[\"" + meetingTimes.getTimesId().toString() + "\",\""
					+ meetingTimes.getYear() + "年第" + meetingTimes.getTimes() + "次\"],");
		}
		if (meetingTimesList.size() > 0) {
			buff.deleteCharAt(buff.length() - 1);
		}
		buff.append("]");
		System.out.println("-----------------------------------"
				+ buff.toString());
		setJsonString(buff.toString());
		return SUCCESS;
	}
}
