package com.gdssoft.oa.service.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.personal.PersonnelEmployee;

public interface PersonnelEmployeeService extends BaseService<PersonnelEmployee>{
	 public void gupdate(String uID,String officephone,String ext ,String shortphone,String room,int isLeader,int isWorkTel);
	 public PersonnelEmployee getByUserID(String uID);
	 public void delByUserId(Long uID);
	 
}


