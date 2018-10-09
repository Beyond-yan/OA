package com.gdssoft.oa.service.duty.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.duty.DutyStaffDao;
import com.gdssoft.oa.model.duty.DutyStaff;
import com.gdssoft.oa.service.duty.DutyStaffService;

public class DutyStaffServiceImpl extends BaseServiceImpl<DutyStaff> implements DutyStaffService{
	@SuppressWarnings("unused")
	private DutyStaffDao dao;
	
	public DutyStaffServiceImpl(DutyStaffDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<DutyStaff> getDutyList(int startSize,Date startDate,Date endDate){
		List<DutyStaff> list1=dao.getDutyList((long) 1,startSize,startDate,endDate);
		List<DutyStaff> list2=dao.getDutyList((long) 2,startSize,startDate,endDate);
		for(DutyStaff dutyStaff1:list1){
			if(dutyStaff1.getAppUser()!=null){
				dutyStaff1.setAmName(dutyStaff1.getAppUser().getFullname());
			}
			for(DutyStaff dutyStaff2:list2){
				if(dutyStaff1.getDutyDate().equals(dutyStaff2.getDutyDate())){
					if(dutyStaff2.getAppUser()!=null){
						dutyStaff1.setPmName(dutyStaff2.getAppUser().getFullname());
					}
				}
			}
		}
		return list1;
	}
	public Long getCount(Long sectionId,Date startDate,Date endDate){
		return dao.getCount(sectionId,startDate,endDate);
	} 
}