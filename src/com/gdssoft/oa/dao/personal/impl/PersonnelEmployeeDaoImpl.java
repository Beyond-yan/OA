package com.gdssoft.oa.dao.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.personal.PersonnelEmployeeDao;
import com.gdssoft.oa.model.personal.PersonnelEmployee;
import com.gdssoft.oa.model.system.AppFunction;

@SuppressWarnings("unchecked")
public class PersonnelEmployeeDaoImpl extends BaseDaoImpl<PersonnelEmployee> implements PersonnelEmployeeDao{

	public PersonnelEmployeeDaoImpl() {
		super(PersonnelEmployee.class);
	}
	
	 
	 // 根据userID 查找
	@Override
	 public PersonnelEmployee getByUserID(String uID)
	 {
		 Long uid = Long.parseLong(uID);
		 String hql = " from PersonnelEmployee p where p.appUser.userId=?";
		 return (PersonnelEmployee)findUnique(hql, new Long[]{uid});
	 }

	@Override
	  public void gupdate(String uID,String officephone,String ext ,String shortphone,String room,int isLeader,int isWorkTel)
	  {
		  officephone = officephone==null?"":officephone;
		  ext = ext==null?"":ext;
		  shortphone = shortphone==null?"":shortphone;
		  room = room==null?"":room;	  
		  
		  StringBuffer sb = new StringBuffer("UPDATE PERSONNEL_EMPLOYEE  SET ");
		  sb.append(" OFFICE_PHONE = '{OFFICE_PHONE}' , ".replace("{OFFICE_PHONE}", officephone));
		  sb.append(" EXT = '{EXT}' , ".replace("{EXT}", ext));
		  sb.append(" SHORT_PHONE = '{SHORT_PHONE}' , ".replace("{SHORT_PHONE}", shortphone));
		  sb.append(" ROOM = '{ROOM}' , ".replace("{ROOM}", room));	
		  sb.append(" UPDATE_BY = '{UPDATE_BY}' ,".replace("{UPDATE_BY}", ContextUtil.getCurrentUser().getUsername()));
		  sb.append(" UPDATE_DATE = '{UPDATE_DATE}' ,".replace("{UPDATE_DATE}", new java.text.SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format( new java.util.Date())));
		  sb.append(" IS_LEADER = '{IS_LEADER}' , ".replace("{IS_LEADER}", String.valueOf(isLeader) ));
		  sb.append(" IS_WORKTEL = '{IS_WORKTEL}'  ".replace("{IS_WORKTEL}", String.valueOf(isWorkTel)));		  
		  sb.append(" where USER_ID = " + uID);		  
		  logger.info(sb.toString());
		  this.getSession().createSQLQuery(sb.toString()).executeUpdate();
		 // jdbcTemplate.execute(sb.toString());
		  
	  }


	@Override
	public void delByUserId(Long uID)
	{
		// TODO Auto-generated method stub
//		String sql = "delete  PersonnelEmployee pe where appUser.userId=:userId";
//		this.getSession().createQuery(sql).setLong("userId", uID).executeUpdate();
		String sql = "delete from PERSONNEL_EMPLOYEE where USER_ID=" + uID;
		this.getSession().createSQLQuery(sql).executeUpdate();
//		jdbcTemplate.execute(sql);
	}
	  

}