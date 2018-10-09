package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarApplyDao;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.admin.CarDriver;

import flexjson.DateTransformer;

@SuppressWarnings("unchecked")
public class CarApplyDaoImpl extends BaseDaoImpl<CarApply> implements
		CarApplyDao {

	public CarApplyDaoImpl() {
		super(CarApply.class);
	}

	public List<CarApply> getUselessCar(Date startDate, Date endDate) {
		StringBuffer sb = new StringBuffer();
		sb.append("from CarApply c where  c.car.carid is not null ");
		List<CarApply> carApplies = new ArrayList<CarApply>();
		if (startDate != null && endDate != null) {
			sb.append(" and (c.startTime>? or c.endTime<?)");
			Object[] objs = { endDate, startDate };
			carApplies = findByHql(sb.toString(), objs);
		} else {
			carApplies = findByHql(sb.toString());
		}
		List<CarApply> carApplyList = getCars();
		carApplyList.removeAll(carApplies);
		return carApplyList;
	}

	@Override
	public Long count(Date startDate, Date endDate) {
		String sql = "SELECT count(*) FROM car_driver a WHERE   NOT EXISTS ("
				+ "SELECT driver FROM car_apply "
				+ "WHERE driver IS NOT NULL AND driver = a.name AND ((endtime > :edt AND starttime <= :edt) "
				+ "OR (endtime > :sta AND starttime <= :sta)))";
		Query q = getSession().createSQLQuery(sql)
				.setParameter("sta", startDate).setParameter("edt", endDate);
		BigDecimal count = null;
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	@Override
	public List<CarDriver> getCarDriverVilabe(Date startDate, Date endDate,
			int size, int start) {
		String sql = "SELECT {a.*} FROM ("
				+ "SELECT rownum as RN0,a.* FROM car_driver a WHERE a.IS_LEAVING!=0 AND NOT EXISTS ("
				+ "SELECT driver FROM car_apply "
				+ "WHERE driver IS NOT NULL AND driver = a.name   AND ((endtime > :edt AND starttime <= :edt) "
				+ "OR (endtime > :sta AND starttime <= :sta)))) a WHERE RN0<=:end and RN0>:start";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a", CarDriver.class).setParameter("sta", startDate)
				.setParameter("edt", endDate).setParameter("start", start)
				.setParameter("end", start + size);
		return q.list();
	}

	

	/**
	 * 车况参考计数
	 */
	public Long carConditionReferCount(int status,String carNo, Date sdt,Date edt) {
		String conditions = "";
		if (null != carNo && !"".equals(carNo))
			conditions += " and c.carno like :carNo ";
		if ( null != sdt)
			conditions += " and c.starttime >= to_char(:sdt,'YYYY-MM-DD HH24:MI:SS' )";
		if ( null != edt)
			conditions += " and c.endtime < to_char(:edt,'YYYY-MM-DD HH24:MI:SS' )";
		if (status != -1 && !"".equals(status))
			conditions += " and c.status=:status ";
		String sql = "select count(*)from (SELECT c.* from (SELECT a.carid, a.carno, a.cartype, a.driver " +
				" AS adriver,a.pass_amount, a.total_distance, b.userfullname, " +
				" to_char(b.starttime,'YYYY-MM-DD HH24:MI:SS') as starttime,to_char(" +
				" b.endtime,'YYYY-MM-DD HH24:MI:SS') as endtime, b.driver AS bdriver, b.reason,CASE WHEN " +
				" (b.starttime <= SYSDATE AND b.endtime >= SYSDATE)THEN 2 WHEN " +
				" endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1 WHEN a.status =2 THEN 4 WHEN a.status = 0 THEN 0 WHEN a.status = 5 THEN 5 ELSE " +
				" 3 END AS status FROM ( select * from car  where IS_PUBLIC=1 and status not in(0,5,2)) a LEFT JOIN (select M.* from (select n.* ," +
				" CASE WHEN (    n.starttime <= SYSDATE AND n.endtime >= SYSDATE ) THEN " +
				" 2 WHEN endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1 ELSE 3 " +
				" END AS sta from car_apply n where n.endtime> SYSDATE)m where not exists( select k.* from (select " +
				" p.* , CASE WHEN (    p.starttime <= SYSDATE  AND p.endtime >= SYSDATE )" +
				" THEN 2 WHEN endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1 " +
				" ELSE 3 END AS sta from car_apply p where p.endtime> SYSDATE)k where k.car_no=m.car_no and " +
				" k.sta=m.sta AND k.sta =3 and m.sta=3 and k.applyid<m.applyid ) ) b ON a.carno = " +
				" b.car_no) c WHERE c.carid IS NOT NULL  " +conditions+
				" order by c.carid DESC, c.status desc )";
		Query q = getSession().createSQLQuery(sql);
		if (null != carNo && !"".equals(carNo))
			q.setParameter("carNo", "%" + carNo + "%"	);
		if ( null != sdt)
			q.setParameter("sdt", sdt);
		if (null != edt)
			q.setParameter("edt", edt);
		if (status != -1 && !"".equals(status))
			q.setParameter("status", status);
		List olist = q.list();
		BigDecimal count = null;
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}
	
	/**
	 * 车况参考
	 */
	public List<CarApply> carConditionRefer(int status,String carNo, Date sdt,
			Date edt, int size, int start) {
		String conditions = "";
		if (null != carNo && !"".equals(carNo))
			conditions += " and c.carno like :carNo ";
		if ( null != sdt)
			conditions += " and c.starttime >= to_char(:sdt,'YYYY-MM-DD HH24:MI:SS' )";
		if ( null != edt)
			conditions += " and c.endtime < to_char(:edt,'YYYY-MM-DD HH24:MI:SS' )";
		if (status != -1 && !"".equals(status))
			conditions += " and c.status=:status ";
		String sql = "SELECT c.* from (SELECT a.carid, a.carno, a.cartype, a.driver " +
				" AS adriver,a.pass_amount, a.total_distance, b.userfullname, " +
				" to_char(b.starttime,'YYYY-MM-DD HH24:MI:SS') as starttime,to_char(" +
				" b.endtime,'YYYY-MM-DD HH24:MI:SS') as endtime, b.driver AS bdriver, " +
				" b.reason,CASE WHEN " +
				" (b.starttime <= SYSDATE AND b.endtime >= SYSDATE)THEN 2 WHEN " +
				" endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1   WHEN a.status =2 THEN 4 WHEN a.status = 0 THEN 0 WHEN a.status = 5 THEN 5 ELSE " +
				" 3 END AS status FROM ( select * from car  where IS_PUBLIC=1 and status not in(0,5,2)) a  LEFT JOIN (select M.* from (select n.* ," +
				" CASE WHEN (    n.starttime <= SYSDATE AND n.endtime >= SYSDATE ) THEN " +
				" 2 WHEN endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1 ELSE 3 " +
				" END AS sta from car_apply n where n.endtime> SYSDATE)m where not exists( select k.* from (select " +
				" p.* , CASE WHEN (    p.starttime <= SYSDATE  AND p.endtime >= SYSDATE )" +
				" THEN 2 WHEN endtime < SYSDATE THEN 3 WHEN starttime > SYSDATE THEN 1 " +
				" ELSE 3 END AS sta from car_apply p where p.endtime> SYSDATE )k where k.car_no=m.car_no and " +
				" k.sta=m.sta AND k.sta =3 and m.sta=3 and k.applyid<m.applyid ) ) b ON a.carno = " +
				" b.car_no) c WHERE c.carid IS NOT NULL " +conditions+
				" order by c.carid DESC, c.status desc ";
		Query q = getSession().createSQLQuery(sql)
			.setFirstResult(start).setMaxResults(size);
		if (null != carNo && !"".equals(carNo))
			q.setParameter("carNo", "%" + carNo + "%"	);
		if ( null != sdt)
			q.setParameter("sdt", sdt);
		if (null != edt)
			q.setParameter("edt", edt);
		if (status != -1 && !"".equals(status))
			q.setParameter("status", status);
		List list = q.list();
		List<CarApply> tempList = new ArrayList<CarApply>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			CarApply apply = new CarApply();
			apply.setApplyId(new Long(objs[0].toString()));
			apply.setCarNo(objs[1].toString());
			apply.setCarType(objs[2].toString());
			if(null==objs[9]){
				if(null!=objs[3]){
					apply.setDriver(objs[3].toString());
				}else{
					apply.setDriver("");
				}
			}else{
				apply.setDriver(objs[9].toString());
			}
			apply.setPeopleAmount(new Short(objs[4].toString()));
			if(null==objs[5]){
				apply.setTotalDistance(null);
			}else{
				apply.setTotalDistance(new Float(objs[5].toString()));
			}
			if(null==objs[6]){
				apply.setUserFullname("");
			}else{
				if(objs[11].toString().equals("3")){
					apply.setUserFullname("");
				}else{
					apply.setUserFullname(objs[6].toString());
				}
				
			}		
			try {
				if(null==objs[7]){
					apply.setStartTime(null);
				}else{
					if(objs[11].toString().equals("3")){
						apply.setStartTime(null);
					}else{
						apply.setStartTime(sdf.parse(objs[7].toString()));
					}			
				}			
			} catch (ParseException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			
			try {
				if(null==objs[8]){
					apply.setEndTime(null);
				}else{
					if(objs[11].toString().equals("3")){
						apply.setEndTime(null);
					}else{
						apply.setEndTime(sdf.parse(objs[8].toString()));
					}				
				}			
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(null==objs[10]){
				apply.setReason("");
			}else{
				apply.setReason(objs[10].toString());
			}
			if(null==objs[11]){
				apply.setStatus(Short.valueOf("3"));
			}else{
				apply.setStatus(Short.parseShort(objs[11].toString()));
			}
			
			tempList.add(apply);
		}
		return tempList;
	}
	
	@Override
	public Long usecount(int status,int status2,String createBy, String carNo,int userId,int operatorId, Date sdt, Date edt) {
		String conditions = "";
		if (null != carNo && !"".equals(carNo))
			conditions += " and a.car_no like :carNo ";
		if (-888!= userId && !"".equals(userId))
			conditions += " and (a.userid = :userId ";
		if ("admin"!= createBy && !"".equals(createBy))
			conditions += " or a.create_by  = :createBy ";
		if (-888!= operatorId && !"".equals(operatorId))
			conditions += " or a.operator_id = :operatorId ";
		if (-888!= userId && !"".equals(userId))
			conditions += ")";
		if ( null != sdt)
			conditions += " and a.STARTTIME >= :sdt ";
		if ( null != edt)
			conditions += " and a.STARTTIME < :edt ";
		if (status != 9 && !"".equals(status))
			conditions += " and (a.status=:status ";
		if (status2 != 9 && !"".equals(status2))
			conditions += " or a.status=:status2 ";
		if (status != 9 && !"".equals(status))
			conditions += ") ";
		String sql = "SELECT count(*) FROM ( SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 2 AS status FROM car_apply WHERE starttime <= SYSDATE AND endtime >= SYSDATE " +
				"UNION SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 0 AS status FROM car_apply WHERE endtime < SYSDATE " +
				"UNION SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 1 AS status FROM car_apply WHERE starttime > SYSDATE ) a " +
				" WHERE (a.approvalstatus=3 or a.approvalstatus=5)" +conditions+
				" ORDER BY a.status DESC";
		Query q = getSession().createSQLQuery(sql);
		if (null != carNo && !"".equals(carNo))
			q.setParameter("carNo","%" + carNo + "%");
		if (-888!= userId && !"".equals(userId))
			q.setParameter("userId",userId);
		if ("admin"!= createBy && !"".equals(createBy))
			q.setParameter("createBy", createBy);
		if (-888!= operatorId && !"".equals(operatorId))
			q.setParameter("operatorId", operatorId);
		if ( null != sdt)
			q.setParameter("sdt", sdt);
		if (null != edt)
			q.setParameter("edt", edt);
		if (status != 9 && !"".equals(status))
			q.setParameter("status", status);
		if (status2 != 9 && !"".equals(status2))
			q.setParameter("status2", status2);
		List olist = q.list();
		BigDecimal count = null;
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}
	
	@Override
	public List<CarApply> usefind(int status,int status2, String createBy,String carNo, Date sdt,
			Date edt,int userId,int operatorId, int size, int start) {
		String conditions = "";
		if (null != carNo && !"".equals(carNo))
			conditions += " and a.car_no like :carNo ";
		if (-888!= userId && !"".equals(userId))
			conditions += " and (a.userid = :userId ";
		if ("admin"!= createBy && !"".equals(createBy))
			conditions += " or a.create_by  = :createBy ";
		if (-888!= operatorId && !"".equals(operatorId))
			conditions += " or a.operator_id = :operatorId ";
		if (-888!= userId && !"".equals(userId))
			conditions += ")";
		if ( null != sdt)
			conditions += " and a.STARTTIME >= :sdt ";
		if ( null != edt)
			conditions += " and a.STARTTIME < :edt ";
		if (status != 9 && !"".equals(status))
			conditions += " and (a.status=:status ";
		if (status2 != 9 && !"".equals(status2))
			conditions += " or a.status=:status2 ";
		if (status != 9 && !"".equals(status))
			conditions += " ) ";
		String sql = "SELECT a.applyid,a.carid,a.department,a.userfullname,a.applydate,a.reason,to_char(a.starttime,'YYYY-MM-DD HH24:MI:SS') as startTime,to_char(a.endtime,'YYYY-MM-DD HH24:MI:SS') as endTime,a.userid,a.proposer,a.mileage,a.oiluse,a.notes,a.approvalstatus " +
				",a.purpose,a.from_site,a.to_site,a.people_amount,a.is_deleted,a.process_ins_id,a.driver_id,a.create_date,a.create_by,a.update_date,a.update_by,a.ishavecardriver,a.iseffective,a.car_no,driver,a.ondutytime,a.offdutytime,a.carids,a.driverids,a.operator_id,a.status,null as task " 
				+" FROM ( SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 2 AS status FROM car_apply WHERE starttime <= SYSDATE AND endtime >=SYSDATE " +
				" UNION SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 0 AS status FROM car_apply WHERE endtime < SYSDATE " +
				" UNION SELECT applyid,carid,department,userfullname,applydate,reason,starttime,endtime,userid,proposer,mileage,oiluse,notes,approvalstatus,purpose,from_site,to_site,people_amount,is_deleted,process_ins_id,driver_id,create_date,create_by,update_date,update_by,ishavecardriver,iseffective,car_no,driver,ondutytime,offdutytime,carids,driverids,operator_id, 1 AS status FROM car_apply WHERE starttime >SYSDATE ) a " +
				" WHERE (a.approvalstatus=3 or a.approvalstatus=5) " +conditions+
				" ORDER BY a.status DESC";
		Query q = getSession().createSQLQuery(sql)
			.setFirstResult(start).setMaxResults(size);
		if (null != carNo && !"".equals(carNo))
			q.setParameter("carNo", "%" + carNo + "%"	);
		if (-888!= userId && !"".equals(userId))
			q.setParameter("userId",userId);
		if ("admin"!= createBy && !"".equals(createBy))
			q.setParameter("createBy", createBy);
		if (-888!= operatorId && !"".equals(operatorId))
			q.setParameter("operatorId", operatorId);
		if ( null != sdt)
			q.setParameter("sdt", sdt);
		if (null != edt)
			q.setParameter("edt", edt);
		if (status != 9 && !"".equals(status))
			q.setParameter("status", status);
		if (status2 != 9 && !"".equals(status2))
			q.setParameter("status2", status2);
		List list = q.list();
		List<CarApply> tempList = new ArrayList<CarApply>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			CarApply apply = new CarApply();
			apply.setApplyId(new Long(objs[0].toString()));
			apply.setDepartment(objs[2].toString());
			apply.setUserFullname(objs[3].toString());
			apply.setReason(objs[5].toString());
			try {
				apply.setStartTime( sdf.parse(objs[6].toString()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			try {
				apply.setEndTime( sdf.parse(objs[7].toString()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			apply.setUserId(Long.valueOf(objs[8].toString()));
			apply.setProposer(objs[9].toString());
			apply.setToSite(objs[16].toString());
			apply.setCreateBy(objs[22].toString());
			apply.setCarNo(objs[27].toString());
			apply.setDriver(objs[28].toString());
			apply.setCarIds(objs[31].toString());
			if(objs[33]!=null){
			apply.setOperatorId(Long.valueOf(objs[33].toString()));}
			else apply.setOperatorId(Long.valueOf(-1));
			apply.setStatus( Short.parseShort(objs[34].toString()));
			tempList.add(apply);
		}
		return tempList;
	}

	public List<CarApply> getCars() {
		String sql = "from CarApply c where  c.car.carid is not null ";
		return findByHql(sql);
	}

	public List<CarApply> getDateCar(Date startDate, Date endDate) {
		StringBuffer sb = new StringBuffer();
		sb.append("from CarApply c where  c.car.carid is not null ");
		List<CarApply> carApplies = new ArrayList<CarApply>();
		if (startDate != null && endDate != null) {
			sb.append(" and (c.startTime=? and c.endTime=?)");
			Object[] objs = { startDate, endDate };
			carApplies = findByHql(sb.toString(), objs);
		}
		return carApplies;
	}

	public List<CarApply> getUserFullCar(Long carId, Date date, Boolean use) {
		// List list = new ArrayList();
		StringBuffer sb = new StringBuffer();
		sb.append("from CarApply c where c.car.carid=?");
		if (use) {
			sb.append(" and c.endTime>?");
		} else {
			sb.append(" and c.endTime<=?");
		}
		Object[] obj = { carId, date };
		return findByHql(sb.toString(), obj);
	}

	public List<CarApply> getIsUserCar(Long carId, Long applyId) {
		// List list = new ArrayList();
		StringBuffer sb = new StringBuffer();
		sb.append("select c from CarApply c left join c.cars r where r.carid=? and c.applyId!=? and c.status=2");
		Object[] obj = { carId, applyId };
		return findByHql(sb.toString(), obj);
	}

	public List<CarApply> getApplyCars(Long carId) {
		String sql = "select c from CarApply c l join c.cars r where r.carid=? and c.status=2 and c.iseffective=2";
		Object[] obj = { carId };
		return findByHql(sql, obj);
	}

	@Override
	public CarApply getCarApplyByRunId(Long runId) {
		// TODO Auto-generated method stub
		String hql = "from CarApply vo where vo.processRun.runId = ?";
		Object[] objs = { runId };
		return (CarApply) findUnique(hql, objs);
	}
}