package com.gdssoft.oa.dao.personal.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.personal.DutyRegisterDao;
import com.gdssoft.oa.model.personal.DutyRegister;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.DateUtil;

public class DutyRegisterDaoImpl extends BaseDaoImpl<DutyRegister> implements DutyRegisterDao{

	public DutyRegisterDaoImpl() {
		super(DutyRegister.class);
	}
	/**
	 * 查取当前用户当天上下班登记情况
	 * @param userId
	 * @param inOffFlag
	 * @param sectionId
	 * @return
	 */
	public DutyRegister getTodayUserRegister(Long userId,Short inOffFlag,Long sectionId){
		String hql="from DutyRegister dr where dr.appUser.userId=? and dr.registerDate>=? and dr.registerDate<=? and dr.inOffFlag=? and dr.dutySection.sectionId=?";
		Calendar cal=Calendar.getInstance();
		cal.add(Calendar.DATE, -1);
		Date startTime=DateUtil.setStartDay(cal).getTime();
		Date endTime=DateUtil.setEndDay(cal).getTime();
		List<DutyRegister> list=findByHql(hql, new Object[]{userId,startTime,endTime,inOffFlag,sectionId});
		if(list.size()>0){
			return list.get(0);
		}
		
		return null;
	}

}