package com.gdssoft.oa.dao.mileages.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 

 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.mileages.MileagesDao;
import com.gdssoft.oa.model.admin.Car;
import com.gdssoft.oa.model.mileages.Mileages;
import com.gdssoft.oa.model.out.OutPerson;
import com.gdssoft.oa.model.system.Department;

@SuppressWarnings("unchecked")
public class MileagesDaoImpl extends BaseDaoImpl<Mileages> implements
		MileagesDao {

	public MileagesDaoImpl() {
		super(Mileages.class);
	}

	public Long count(Date startDate, Date endDate, String cn) {
		String filterSql = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		String sql = " SELECT count(*) FROM car a JOIN (SELECT   TRUNC (travel_date, 'y') AS travel_date, car_id, SUM (end_number)  end_number FROM car_mileages ";
		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {
			filterSql = " WHERE travel_date >= TO_DATE ('"
					+ sdf.format(startDate) + "-01-01"
					+ "','YYYY-MM-DD') AND travel_date<= TO_DATE ('"
					+ sdf.format(endDate) + "-12-31" + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {
			filterSql = " WHERE travel_date >= TO_DATE ('"
					+ sdf.format(startDate) + "-01-01" + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {
			filterSql = " WHERE travel_date <= TO_DATE ('"
					+ sdf.format(endDate) + "-12-31" + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql
				+ " GROUP BY car_id, TRUNC (travel_date, 'y')) temp ON carid =car_id where 1=1";
		if (null!=cn && !"".equals(cn))  {
			sql += "and carno like  '%"+cn+"%'";
		}
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = null;
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	public List<Mileages> selectByCostType(Date startDate, Date endDate,
			String cn, int size, int start) {
		String filterSql = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		String sql = " SELECT * FROM (SELECT ROWNUM AS rnun, carno, TO_CHAR (travel_date, 'YYYY') AS YEAR, NVL (MONTH_MILEAGE, 0) MONTH_MILEAGE FROM car a JOIN (SELECT   TRUNC (travel_date, 'y') AS travel_date, car_id, SUM (MONTH_MILEAGE)  MONTH_MILEAGE FROM car_mileages ";
		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {
			filterSql = " WHERE travel_date >= TO_DATE ('"
					+ sdf.format(startDate) + "-01-01"
					+ "','YYYY-MM-DD') AND travel_date<= TO_DATE ('"
					+ sdf.format(endDate) + "-12-31" + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {
			filterSql = " WHERE travel_date >= TO_DATE ('"
					+ sdf.format(startDate) + "-01-01" + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {
			filterSql = " WHERE travel_date <= TO_DATE ('"
					+ sdf.format(endDate) + "-12-31" + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql
				+ " GROUP BY car_id, TRUNC (travel_date, 'y')) temp ON a.carid =temp.car_id where 1=1 ";
		if (null!=cn && !"".equals(cn)) {
			sql += "and carno like '%"+cn+"%'";
		}

		sql += " )WHERE rnun<=" + (start + size) + " and rnun>" + start;
		Query q = getSession().createSQLQuery(sql);
		List listObjects = q.list();
		System.out.println("sql: " + sql);
		/*
		 * List<Mileages> list = new ArrayList<Mileages>(); for (Object object :
		 * listObjects) { Object[] objs = (Object[]) object; for (Object obj :
		 * objs) { if (obj.getClass().getName()
		 * .equals("com.gdssoft.oa.model.mileages.Mileages")) { Mileages op =
		 * (Mileages) obj; list.add(op); break; } } }
		 */
		/*
		 * ArrayList<Object> arrayList=new ArrayList<Object>(); Object[]
		 * objects=arrayList.toArray(); List<Object>
		 * listObjects=(List<Object>)jdbcTemplate.queryForList(sql,objects);
		 */
		List<Mileages> list = new ArrayList<Mileages>();
		for (Object itObject:listObjects) {
			Mileages mileage = new Mileages();
			Date travelDate = null;
			String carno = "";
			String end_number = "";
			Object[] a = (Object[])itObject ;
            String b=(String)a[1]; 
			if (null != a[2]) {
				SimpleDateFormat sd = new SimpleDateFormat("yyyy");
				try {
					travelDate = sd.parse(a[2].toString());
				} catch (ParseException e) {
					e.printStackTrace();
				}
				mileage.setTravelDate(travelDate);
			} else {
				mileage.setTravelDate(null);
			}
			if (null != a[3]) {
				end_number = a[3].toString();
				mileage.setEndNumber(end_number);
			} else {
				end_number = "";
			}
			if (null !=a[1]) {
				carno = a[1].toString();
				mileage.setCarno(carno);
			} else {
				mileage.setCarno(null);
			}
			list.add(mileage);
		}
		/*
		 * for (Object iterObject : listObjects) { Map<String, Object> map =
		 * (Map) iterObject; Mileages mileage = new Mileages(); String carno =
		 * ""; Date travelDate = null; String end_number = ""; if
		 * (map.get("year") != null) { SimpleDateFormat sd = new
		 * SimpleDateFormat("yyyy"); try { travelDate =
		 * sd.parse(map.get("year").toString()); } catch (ParseException e) {
		 * e.printStackTrace(); } mileage.setTravelDate(travelDate); } else {
		 * mileage.setTravelDate(null); } if (map.get("end_number") != null) {
		 * end_number = map.get("end_number").toString();
		 * mileage.setEndNumber(end_number); } else { end_number = ""; } if
		 * (map.get("carno") != null) { carno = map.get("carno").toString();
		 * mileage.setCarno(carno); } else { carno = ""; } list.add(mileage); }
		 */
		return list;

	}
}