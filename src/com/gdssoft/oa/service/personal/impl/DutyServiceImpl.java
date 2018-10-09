package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.personal.DutyDao;
import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.oa.service.personal.DutyService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DutyServiceImpl extends BaseServiceImpl<Duty> implements DutyService{
	private DutyDao dao;
	
	public DutyServiceImpl(DutyDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.personal.DutyService#isExistDutyForUser(java.lang.Long, java.util.Date, java.util.Date)
	 */
	public boolean isExistDutyForUser(Long userId, Date startTime, Date endTime) {
		List dutyList=dao.getUserDutyByTime(userId, startTime, endTime);
		if(dutyList.size()>0) return true;
		return false;
	}
	
	/**
	 * 取当前用户的班制
	 * @param userId
	 * @return
	 */
	public Duty getCurUserDuty(Long userId){
		List<Duty> dutyList=dao.getCurUserDuty(userId);
		if(dutyList.size()>0){
			return dutyList.get(0);
		}
		return null;
	}
	
}