package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.lucene.store.jdbc.support.JdbcTemplate;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.BoardrooDao;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.out.OutPerson;

@SuppressWarnings("unchecked")
public class BoardrooDaoImpl extends BaseDaoImpl<Boardroo> implements BoardrooDao{

	private static SimpleDateFormat sdf = new SimpleDateFormat(
	"yyyy-MM-dd HH:mm:ss");
	
	public BoardrooDaoImpl() {
		super(Boardroo.class);
	}

	@Override
	public List<Boardroo> searchBoRoomByTime(Date startTime, Date endTime,int isLong) {
		// TODO Auto-generated method stub
		List<Boardroo> list=new ArrayList<Boardroo>();	
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql="";
		//String startTimeFormt=sdf.format(startTime);
		//String endTimeFormt=sdf.format(endTime);		
		String 	sql="select count(1) from Conference t where  t.apply_Status in (1,2) and  t.is_Long not in (2) and ";
		sql+= "((CONVERT(varchar(16),t.startTime,20) <=  CONVERT(varchar(16),'"+sdf.format(startTime)+"',20) and  CONVERT(varchar(16),t.endTime,20) >=CONVERT(varchar(16),'"+sdf.format(endTime)+"',20))  ";
		sql += " or (CONVERT(varchar(16),t.startTime,20)>= CONVERT(varchar(16),'"+sdf.format(startTime)+"',20) and CONVERT(varchar(16),t.startTime,20) < CONVERT(varchar(16),'"+sdf.format(endTime)+"',20))  ";
		sql += " or (CONVERT(varchar(16),t.endTime,20) > CONVERT(varchar(16),'"+sdf.format(startTime)+"',20) and CONVERT(varchar(16),t.endTime,20) <=CONVERT(varchar(16),'"+sdf.format(endTime)+"',20))) ";
		int count=this.jdbcTemplate.queryForInt(sql);
		if(count>0){	
		 if(isLong==0)	{//短期会议室的调整--查找不存在冲突的会议室		
		hql=" select br from Boardroo br where br.roomId not  in  (";
		hql+="select distinct t.roomId  from Conference t where  t.applyStatus in (1,2) and  t.isLong not in (2) and ";
		hql += "((CONVERT(varchar(16),t.startTime,20) <=  CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) >=CONVERT(varchar(16),?,20))  ";
		hql += " or (CONVERT(varchar(16),t.startTime,20)>= CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.startTime,20) < CONVERT(varchar(16),?,20))  ";
		hql += " or (CONVERT(varchar(16),t.endTime,20) > CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) <=CONVERT(varchar(16),?,20)))) ";
		 }
		 else{//长期会议室的调整--查询存在冲突的会议室
		hql=" select br from Boardroo br where br.roomId in  (";
		hql+="select distinct t.roomId  from Conference t where  t.applyStatus in (1,2) and  t.isLong not in (2) and ";
		hql += "((CONVERT(varchar(16),t.startTime,20) <=  CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) >=CONVERT(varchar(16),?,20))  ";
		hql += " or (CONVERT(varchar(16),t.startTime,20)>= CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.startTime,20) < CONVERT(varchar(16),?,20))  ";
		hql += " or (CONVERT(varchar(16),t.endTime,20) > CONVERT(varchar(16),?,20) and CONVERT(varchar(16),t.endTime,20) <=CONVERT(varchar(16),?,20)))) ";
		 }
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);
		paramList.add(startTime);
		paramList.add(endTime);				
		System.out.println("hql---adjust-"+hql);
		list = findByHql(hql, paramList.toArray());
		System.out.println("room"+list.size());
		 }
		 return list; 
		
	}
	
	public List<Boardroo> listConference(Date startDate, Date endDate){
		List<Boardroo> list = new ArrayList<Boardroo>();
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = "";
		hql = "from Boardroo br left join br.conferences cf where ";
		hql += " cf.startTime >=? and cf.endTime <= ? and cf.timeNumber is not null";
		paramList.add(startDate);
		paramList.add(endDate);
		System.out.println("hql---adjust-"+ hql);
		list = findByHql(hql, paramList.toArray());
		System.out.println("room" + list.size());
		return list;
	}
	
	public List<Boardroo>  getAllOrderCode() {
		List<Boardroo> list = new ArrayList<Boardroo>();
		String hql = "";
		hql = "from Boardroo br order by code";
		list = findByHql(hql);
		return list;
	}
	
/*	@Override
	public List<Boardroo> searchUsedBoRoomByTime(Date startTime, Date endTime) {
		// TODO Auto-generated method stub			
		List<Boardroo> list=new ArrayList<Boardroo>();	
		String startTimeFormt=sdf.format(startTime);
		String endTimeFormt=sdf.format(endTime);		
		String 	sql="select count(1) from Conference t where  t.apply_Status in (1,2) and  t.is_Long not in (2) and ";
		sql+= "((CONVERT(varchar(16),t.startTime,20) <=  CONVERT(varchar(16),"+"'"+startTimeFormt+"'"+"',20) and t.endTime >=CONVERT(varchar(16),"+"'"+endTimeFormt+"',20))  ";
		sql += " or (t.endTime >= CONVERT(varchar(16),"+"'"+startTimeFormt+"'"+"',20) and t.endTime <=CONVERT(varchar(16),"+"'"+endTimeFormt+"',20))  ";
		sql += " or (t.startTime >= CONVERT(varchar(16),"+"'"+startTimeFormt+"'"+"',20) and t.startTime <= CONVERT(varchar(16),"+"'"+endTimeFormt+"',20)) ";
		sql +="  or (t.startTime  >= CONVERT(varchar(16),"+"'"+startTimeFormt+"'"+"',20) and t.endTime <=CONVERT(varchar(16),"+"'"+endTimeFormt+"',20))) ";
		
		 int count=this.jdbcTemplate.queryForInt(sql);		 
		 if(count>0){		
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql=" select br from Boardroo br where br.roomId   in  (";
		hql+="select distinct t.roomId  from Conference t where  t.applyStatus in (1,2) and  t.isLong not in (2) and ";
		hql += "((t.startTime <=  CONVERT(varchar(23),?) and t.endTime >=CONVERT(varchar(23),?))  ";
		hql += " or (t.endTime >= CONVERT(varchar(23),?) and t.endTime <=CONVERT(varchar(23),?))  ";
		hql += " or (t.startTime >= CONVERT(varchar(23),?) and t.startTime <= CONVERT(varchar(23),?)) ";
		hql +="  or (t.startTime  >= CONVERT(varchar(23),?) and t.endTime <=CONVERT(varchar(23),?)) )) ";
		paramList.add(sdf.format(startTime));
		paramList.add(sdf.format(endTime));
		paramList.add(sdf.format(startTime));
		paramList.add(sdf.format(endTime));
		paramList.add(sdf.format(startTime));
		paramList.add(sdf.format(endTime));
		paramList.add(sdf.format(startTime));
		paramList.add(sdf.format(endTime));
		System.out.println("-----startTime-@@------"+sdf.format(startTime));
		System.out.println("------endTime---@@-----"+sdf.format(endTime));
		System.out.println("------hql-------adjust-"+hql);
		list = findByHql(hql, paramList.toArray());
		System.out.println("------------------list-----datebase333----------"+list.size());		
		 }
		 return list; 		
	}*/
}