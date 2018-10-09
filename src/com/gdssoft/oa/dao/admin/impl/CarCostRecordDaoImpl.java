package com.gdssoft.oa.dao.admin.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarCostRecordDao;
import com.gdssoft.oa.model.admin.CarCostRecord;

public class CarCostRecordDaoImpl extends BaseDaoImpl<CarCostRecord> implements
		CarCostRecordDao {

	public CarCostRecordDaoImpl() {
		super(CarCostRecord.class);
		// TODO Auto-generated constructor stub
	}

	/**
	 * 按费用类别统计总金额
	 */
	public Float totalAmtSumTypeName(Date startDate, Date endDate) {
		String filterSql = "";
		String sql = "SELECT sum(sumprice) FROM (SELECT  a.cost_type_id, COUNT (*) "
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + " GROUP BY a.cost_type_id) b left JOIN car_cost_type "
				+ " TYPE ON b.cost_type_id = TYPE.ID";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = null;
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count != null ? count.floatValue() : 0;

	}

	/**
	 * 按车辆和类型统计总金额
	 */
	public Float totalSumCarAndType(Date startDate, Date endDate) {
		String filterSql = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String sql = " SELECT sum(sumprice) FROM car right JOIN"
				+ " (SELECT TYPE.cost_name AS typename,NVL (b.counttype, 0)"
				+ " AS counttype,NVL (b.sumprice, 0) AS sumprice, b.ci AS cai"
				+ " FROM (SELECT   a.cost_type_id, a.car_id AS ci,COUNT (*)"
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM"
				+ " car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY a.cost_type_id, a.car_id) b left JOIN"
				+ " car_cost_type TYPE ON b.cost_type_id = TYPE.ID ) tp "
				+ " ON car.carid = tp.cai  ";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = null;
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count != null ? count.floatValue() : 0;
	}

	/**
	 * 按车辆和类型查询的总记录数
	 */
	public Long countByCarAndType(Date startDate, Date endDate) {
		String filterSql = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String sql = " SELECT count(*) FROM car right JOIN"
				+ " (SELECT TYPE.cost_name AS typename,NVL (b.counttype, 0)"
				+ " AS counttype,NVL (b.sumprice, 0) AS sumprice, b.ci AS cai"
				+ " FROM (SELECT   a.cost_type_id, a.car_id AS ci,COUNT (*)"
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM"
				+ " car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY a.cost_type_id, a.car_id) b left JOIN"
				+ " car_cost_type TYPE ON b.cost_type_id = TYPE.ID ) tp "
				+ " ON car.carid = tp.cai  ";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = new BigDecimal(0);
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	/**
	 * 按车辆和类型查询
	 */
	public List<CarCostRecord> selectByCarAndType(Date startDate, Date endDate,
			int start, int size) {
		String filterSql = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String sql = "SELECT * FROM (SELECT ROWNUM AS rnn, temp.* FROM"
				+ " (SELECT car.carno, tp.* FROM car right JOIN"
				+ " (SELECT TYPE.cost_name AS typename,NVL (b.counttype, 0)"
				+ " AS counttype,NVL (b.sumprice, 0) AS sumprice, b.ci AS cai"
				+ " FROM (SELECT   a.cost_type_id, a.car_id AS ci,COUNT (*)"
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM"
				+ " car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY a.cost_type_id, a.car_id) b left JOIN"
				+ " car_cost_type TYPE ON b.cost_type_id = TYPE.ID ) "
				+ " tp ON car.carid = tp.cai) temp) WHERE rnn > " + start
				+ " AND rnn <=" + (start + size);
		ArrayList<Object> arrayList = new ArrayList<Object>();
		Object[] objects = arrayList.toArray();
		List<Object> listObjects = (List<Object>) jdbcTemplate.queryForList(
				sql, objects);
		List<CarCostRecord> list = new ArrayList<CarCostRecord>();
		for (Object iterObject : listObjects) {
			Map<String, Object> map = (Map) iterObject;

			CarCostRecord carCostRecord = new CarCostRecord();
			String carNo = "";
			String typeName = "";
			String countCT = "";
			String sumPrice = "";
			if (map.get("carno") != null) {
				carNo = map.get("carno").toString();
			} else {
				carNo = "";
			}
			carCostRecord.setCreateUser(carNo);

			if (map.get("typename") != null) {
				typeName = map.get("typename").toString();
			} else {
				typeName = "";
			}
			carCostRecord.setTypeName(typeName);
			if (map.get("counttype") != null) {
				countCT = map.get("counttype").toString();
				carCostRecord.setItemQty(Float.valueOf(countCT));
			} else {
				carCostRecord.setItemQty(0F);
			}
			if (map.get("sumPrice") != null) {
				sumPrice = map.get("sumPrice").toString();
				carCostRecord.setTotalAmt(Float.valueOf(sumPrice));
			} else {
				carCostRecord.setTotalAmt(0F);
			}

			list.add(carCostRecord);
		}

		return list;

	}

	/**
	 * 按车辆和时间统计总金额
	 */
	public Float totalSumCarAndTime(Date startDate, Date endDate) {
		String filterSql = "";
		String sql = " SELECT sum(sumprice) FROM car a right JOIN (SELECT   car_id, RECORD.cost_date,"
				+ " COUNT (*) AS countct,SUM (RECORD.total_amt) AS"
				+ " sumprice FROM car_cost_record RECORD";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY cost_date, car_id) b ON a.carid = b.car_id  ";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = null;
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count != null ? count.floatValue() : 0;
	}

	/**
	 * 按车辆和时间查询的总记录数
	 */
	public Long count(Date startDate, Date endDate) {
		String filterSql = "";
		String sql = " SELECT count(*) FROM car a right JOIN (SELECT   car_id, RECORD.cost_date,"
				+ " COUNT (*) AS countct,SUM (RECORD.total_amt) AS"
				+ " sumprice FROM car_cost_record RECORD";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY cost_date, car_id) b ON a.carid = b.car_id  ";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = new BigDecimal(0);
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	/**
	 * 按车辆和时间查询
	 */
	public List<CarCostRecord> selectByCarAndTime(Date startDate, Date endDate,
			int start, int size) {
		String filterSql = "";
		String sql = "SELECT * FROM (SELECT ROWNUM AS rnun, temp.*"
				+ " FROM ( SELECT a.carno AS carNo, b.cost_date As costDate,"
				+ " NVL (b.countct, 0) countCT,NVL (b.sumprice, 0) sumPrice "
				+ " FROM car a right JOIN (SELECT   car_id, RECORD.cost_date,"
				+ " COUNT (*) AS countct,SUM (RECORD.total_amt) AS"
				+ " sumprice FROM car_cost_record RECORD";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + "  GROUP BY cost_date, car_id) b ON a.carid = b.car_id  "
				+ " ) temp) WHERE rnun > " + start + " AND rnun <= "
				+ (start + size);
		ArrayList<Object> arrayList = new ArrayList<Object>();
		Object[] objects = arrayList.toArray();
		List<Object> listObjects = (List<Object>) jdbcTemplate.queryForList(
				sql, objects);
		List<CarCostRecord> list = new ArrayList<CarCostRecord>();
		for (Object iterObject : listObjects) {
			Map<String, Object> map = (Map) iterObject;

			CarCostRecord carCostRecord = new CarCostRecord();
			String carNo = "";
			String costDate = "";
			String countCT = "";
			String sumPrice = "";
			if (map.get("carNo") != null) {
				carNo = map.get("carNo").toString();
			} else {
				carNo = "";
			}
			carCostRecord.setTypeName(carNo);

			if (map.get("costDate") != null) {
				costDate = map.get("costDate").toString();
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				try {
					carCostRecord.setCostDate(sdf.parse(costDate));
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} else {
				carCostRecord.setCostDate(null);
			}
			if (map.get("countCT") != null) {
				countCT = map.get("countCT").toString();
				carCostRecord.setItemQty(Float.valueOf(countCT));
			} else {
				carCostRecord.setItemQty(0F);
			}
			if (map.get("sumPrice") != null) {
				sumPrice = map.get("sumPrice").toString();
				carCostRecord.setTotalAmt(Float.valueOf(sumPrice));
			} else {
				carCostRecord.setTotalAmt(0F);
			}

			list.add(carCostRecord);
		}

		return list;

	}

	/**
	 * 按费用类别查询的总记录数
	 */
	public Long countByTypeName(Date startDate, Date endDate) {
		String filterSql = "";
		String sql = "SELECT count(*) FROM (SELECT  a.cost_type_id, COUNT (*) "
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + " GROUP BY a.cost_type_id) b left JOIN car_cost_type "
				+ " TYPE ON b.cost_type_id = TYPE.ID";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = new BigDecimal(0);
		List olist = q.list();
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	/**
	 * 按费用类别查询
	 */
	public List<CarCostRecord> selectByCostType(Date startDate, Date endDate,
			int start, int size) {
		String filterSql = "";
		String sql = "SELECT * FROM (SELECT ROWNUM AS rnn, temp.*"
				+ " FROM (SELECT TYPE.cost_name AS typeName, NVL (b.countType, 0) As countType,"
				+ "  NVL (b.sumPrice, 0) As sumPrice FROM (SELECT  a.cost_type_id, COUNT (*) "
				+ " AS counttype,SUM (a.total_amt) AS sumprice FROM car_cost_record a";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date BETWEEN TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') AND TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
			filterSql = " WHERE a.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			sql += filterSql;
		}
		sql = sql + " GROUP BY a.cost_type_id) b left JOIN car_cost_type "
				+ " TYPE ON b.cost_type_id = TYPE.ID) temp)WHERE rnn > "
				+ start + " AND rnn <=" + (start + size);
		ArrayList<Object> arrayList = new ArrayList<Object>();
		Object[] objects = arrayList.toArray();
		List<Object> listObjects = (List<Object>) jdbcTemplate.queryForList(
				sql, objects);
		List<CarCostRecord> list = new ArrayList<CarCostRecord>();
		for (Object iterObject : listObjects) {
			Map<String, Object> map = (Map) iterObject;

			CarCostRecord carCostRecord = new CarCostRecord();
			String typeName = "";
			String countType = "";
			String sumPrice = "";
			if (map.get("typeName") != null) {
				typeName = map.get("typeName").toString();
			} else {
				typeName = "";
			}
			carCostRecord.setTypeName(typeName);
			if (map.get("countType") != null) {
				countType = map.get("countType").toString();
				carCostRecord.setItemQty(Float.valueOf(countType));
			} else {
				carCostRecord.setItemQty(0F);
			}
			if (map.get("sumPrice") != null) {
				sumPrice = map.get("sumPrice").toString();
				carCostRecord.setTotalAmt(Float.valueOf(sumPrice));
			} else {
				carCostRecord.setTotalAmt(0F);
			}

			list.add(carCostRecord);
		}

		return list;

	}

	/**
	 * 按时间统计总金额
	 */
	public Float totalSumCostDate(Date startDate, Date endDate, String selectBy) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String filterSql = "";
		String sql = " SELECT SUM (temp.sumprice) FROM (SELECT   SUM (total_amt) "
				+ " AS sumprice FROM car_cost_record RECORD";
		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			if ("D".equals(selectBy)) {
				filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD') AND TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD'),'YYYY-MM') AND  TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-dd'),'YYYY') AND TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-dd'),'YYYY')";
			}
				sql += filterSql;
			
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY-MM') ";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY') ";
			}
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY')";
			}
			sql += filterSql;
		}
		sql = sql + " GROUP BY ";
		if("D".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM-DD') ";
		}else if("M".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM')  ";
		}else{
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY') ";
		}
		sql+=" ) temp ";
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = new BigDecimal(0);
		List olist = q.list();
		if (olist.size() > 0) {
			count = (BigDecimal) olist.get(0);
		}
		return count != null ? count.floatValue() : 0;
	}

	/**
	 * 按时间查询的总记录数
	 */
	public Long countByCostDate(Date startDate, Date endDate, String selectBy) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String filterSql = "";
		String sql = " SELECT count(*) FROM car_cost_record RECORD";
		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			if ("D".equals(selectBy)) {
				filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD') AND TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD'),'YYYY-MM') AND  TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-dd'),'YYYY') AND TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-dd'),'YYYY')";
			}
				sql += filterSql;
			
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY-MM') ";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY') ";
			}
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY')";
			}
			sql += filterSql;
		}
		sql = sql + " GROUP BY ";
		if("D".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM-DD') ";
		}else if("M".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM')  ";
		}else{
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY') ";
		}
		Query q = getSession().createSQLQuery(sql);
		BigDecimal count = new BigDecimal(0);
		List olist = q.list();
		if (olist.size() > 0) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	/**
	 * 按时间查询
	 * 
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<CarCostRecord> selectByCostDate(Date startDate, Date endDate,
			int start, int size, String selectBy) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
		String filterSql = "";
		String sql = " SELECT * FROM (SELECT ROWNUM AS rnn, temp.* FROM (SELECT ";
		if("D".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM-DD') ";
		}else if("M".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM')  ";
		}else{
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY') ";
		}
		sql+=" AS costDate, COUNT (RECORD.cost_date) AS countDate,"
				+ " SUM (RECORD.total_amt) AS sumPrice FROM"
				+ " car_cost_record RECORD";

		if (startDate != null && !"".equals(startDate.toString().trim())
				&& endDate != null && !"".equals(endDate.toString().trim())) {

			if ("D".equals(selectBy)) {
				filterSql = " WHERE RECORD.cost_date BETWEEN TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD') AND TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-DD'),'YYYY-MM') AND  TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') BETWEEN TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate)
						+ "','YYYY-MM-dd'),'YYYY') AND TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-dd'),'YYYY')";
			}
				sql += filterSql;
			
		} else if ((startDate != null && !""
				.equals(startDate.toString().trim()))
				&& (endDate == null || "".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date >= TO_DATE ('"
					+ sdf.format(startDate) + "','YYYY-MM-DD') ";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY-MM') ";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') >= TO_CHAR(TO_DATE ('"
						+ sdf.format(startDate) + "','YYYY-MM-DD'),'YYYY') ";
			}
			sql += filterSql;
		} else if ((startDate == null || "".equals(startDate.toString().trim()))
				&& (endDate != null && !"".equals(endDate.toString().trim()))) {

			if ("D".equals(selectBy)) {
			filterSql = " WHERE RECORD.cost_date <= TO_DATE ('"
					+ sdf.format(endDate) + "','YYYY-MM-DD')";
			}else if("M".equals(selectBy)){
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY-MM') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY-MM')";
			}else{
				filterSql = " WHERE TO_CHAR(RECORD.cost_date,'YYYY') <= TO_CHAR(TO_DATE ('"
						+ sdf.format(endDate) + "','YYYY-MM-DD'),'YYYY')";
			}
			sql += filterSql;
		}
		sql = sql + " GROUP BY ";
		if("D".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM-DD') ";
		}else if("M".equals(selectBy)){
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY-MM')  ";
		}else{
			sql=sql+" TO_CHAR(RECORD.cost_date,'YYYY') ";
		}
		sql+=" ) temp)WHERE rnn > " + start+ " AND rnn <=" + (start + size);
		ArrayList<Object> arrayList = new ArrayList<Object>();
		Object[] objects = arrayList.toArray();
		List<Object> listObjects = (List<Object>) jdbcTemplate.queryForList(
				sql, objects);
		List<CarCostRecord> list = new ArrayList<CarCostRecord>();
		for (Object iterObject : listObjects) {
			Map<String, Object> map = (Map) iterObject;

			CarCostRecord carCostRecord = new CarCostRecord();
			String costDate = "";
			String countDate = "";
			String sumPrice = "";
			if (map.get("costDate") != null) {
				costDate = map.get("costDate").toString();
				carCostRecord.setCostComment(costDate);
			} else {
				carCostRecord.setCostComment("");
			}
			if (map.get("countDate") != null) {
				countDate = map.get("countDate").toString();
				carCostRecord.setItemQty(Float.valueOf(countDate));
			} else {
				carCostRecord.setItemQty(0F);
			}
			if (map.get("sumPrice") != null) {
				sumPrice = map.get("sumPrice").toString();
				carCostRecord.setTotalAmt(Float.valueOf(sumPrice));
			} else {
				carCostRecord.setTotalAmt(0F);
			}

			list.add(carCostRecord);
		}

		return list;

	}

	/**
	 * 费用统计
	 */
	public List<CarCostRecord> costStatistics(Date startDate, Date endDate,
			String selectBy, String carIds) {

		String filterSql = "";
		String sql = "";
		if (carIds != null && !"".equals(carIds)) {
			sql += "SELECT cp.* FROM (";
		}
		sql +=    " SELECT r.carno,r.carid, r.cost_name, NVL (r.total_distance, 0) AS "
				+ " distance, r.driver,NVL (s.sumprice, 0) AS sumprice ,D.MONTH_MILEAGE FROM"
				+ " (SELECT carid, carno, driver, total_distance, ID AS typeid,"
				+ " cost_name FROM car_cost_type cross join car) r LEFT JOIN (SELECT"
				+ " a.cost_type_id, a.car_id AS ci, SUM (a.total_amt) AS sumprice"
				+ " FROM car_cost_record a";

		if ("T".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.cost_date BETWEEN TO_DATE (:startDate,'YYYY-MM-DD') " +
						"AND TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.cost_date >= TO_DATE (:startDate,'YYYY-MM-DD') ";
				sql += filterSql;
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.cost_date <= TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			}
		} else if ("M".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				SimpleDateFormat sdf2 = new SimpleDateFormat("MM");
				Long month = Long.valueOf(sdf2.format(startDate));
				if (month == 12) {
					filterSql = " WHERE a.cost_date >= TO_DATE (:startDate,'YYYY-MM-DD') AND  a.cost_date <= TO_DATE (:endDate,'YYYY-MM-DD')";
					sql += filterSql;
				} else {
					filterSql = " WHERE a.cost_date >= TO_DATE (:startDate,'YYYY-MM-DD') AND  a.cost_date < TO_DATE (:endDate,'YYYY-MM-DD')";
					sql += filterSql;
				}
			}
		} else if ("Y".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.cost_date BETWEEN TO_DATE (:startDate,'YYYY-MM-DD') AND TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.cost_date >= TO_DATE (:startDate,'YYYY-MM-DD') ";
				sql += filterSql;
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.cost_date <= TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			}
		
		}
		sql = sql + "   GROUP BY a.cost_type_id, a.car_id) s ON r.carid "
				+ " = s.ci AND r.typeid = s.cost_type_id";
		sql += " left join ( select  A.CAR_ID,SUM( A.MONTH_MILEAGE) as MONTH_MILEAGE from CAR_MILEAGES a ";
		if ("T".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.TRAVEL_DATE BETWEEN TO_DATE (:startDate,'YYYY-MM-DD') " +
						"AND TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.TRAVEL_DATE >= TO_DATE (:startDate,'YYYY-MM-DD') ";
				sql += filterSql;
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				filterSql = " WHERE a.TRAVEL_DATE <= TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			}
		} else if ("M".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				SimpleDateFormat sdf2 = new SimpleDateFormat("MM");
				Long month = Long.valueOf(sdf2.format(startDate));
				if (month == 12) {
					filterSql = " WHERE a.TRAVEL_DATE >= TO_DATE (:startDate,'YYYY-MM-DD') AND  a.TRAVEL_DATE <= TO_DATE (:endDate,'YYYY-MM-DD')";
					sql += filterSql;
				} else {
					filterSql = " WHERE a.TRAVEL_DATE >= TO_DATE (:startDate,'YYYY-MM-DD') AND  a.TRAVEL_DATE < TO_DATE (:endDate,'YYYY-MM-DD')";
					sql += filterSql;
				}
			}
		} else if ("Y".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.TRAVEL_DATE BETWEEN TO_DATE (:startDate,'YYYY-MM-DD') AND TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.TRAVEL_DATE >= TO_DATE (:startDate,'YYYY-MM-DD') ";
				sql += filterSql;
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				filterSql = " WHERE a.TRAVEL_DATE <= TO_DATE (:endDate,'YYYY-MM-DD')";
				sql += filterSql;
			}
		
		}
		sql+=" GROUP BY A.CAR_ID ) d on D.CAR_ID=R.CARID ";
		if (carIds != null && !"".equals(carIds)) {
			sql += "  ) cp WHERE cp.carid in("+carIds+") ORDER BY cp.cost_name DESC, cp.carid ASC";
		}else{
		sql+=" order by r.cost_name desc ,r.carid asc";
		}
		ArrayList<Object> arrayList = new ArrayList<Object>();
		Object[] objects = arrayList.toArray();
		Query q=getSession().createSQLQuery(sql);
		if ("T".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				q.setParameter("startDate", sdf.format(startDate));
				q.setParameter("endDate", sdf.format(endDate));
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				q.setParameter("startDate", sdf.format(startDate));
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
				q.setParameter("endDate", sdf.format(endDate));
			}
		} else if ("M".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				SimpleDateFormat sdf2 = new SimpleDateFormat("MM");
				Long month = Long.valueOf(sdf2.format(startDate));
				if (month == 12) {
					q.setParameter("startDate", sdf.format(startDate) + "/" + 12 + "/" + 01);
				    q.setParameter("endDate", sdf.format(startDate) + "/" + 12 + "/" + 31);
				} else {
					q.setParameter("startDate", sdf.format(startDate)+ "/" + month + "/" + 01);
					q.setParameter("endDate", sdf.format(startDate) + "/" + (month + 1) + "/"+ 01);
				}
			}
		} else if ("Y".equals(selectBy)) {
			if (startDate != null && !"".equals(startDate.toString().trim())
					&& endDate != null && !"".equals(endDate.toString().trim())) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				q.setParameter("startDate", sdf.format(startDate)+ "/" + 01 + "/" + 01);
				q.setParameter("endDate", sdf.format(endDate)+ "/" + 12 + "/" + 31);
			} else if ((startDate != null && !"".equals(startDate.toString()
					.trim()))
					&& (endDate == null || "".equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				q.setParameter("startDate", sdf.format(startDate)+ "/" + 01 + "/" + 01);
			} else if ((startDate == null || "".equals(startDate.toString()
					.trim()))
					&& (endDate != null && !""
							.equals(endDate.toString().trim()))) {

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
				q.setParameter("endDate", sdf.format(endDate)+ "/" + 12 + "/" + 31);
			}
		
		}
		List listObjects = q.list();
		List<CarCostRecord> list = new ArrayList<CarCostRecord>();
		if(listObjects.size()>0){
			for (int i = 0; i < listObjects.size(); i++) {
				Object[] obj=(Object[])listObjects.get(i);
				CarCostRecord carCostRecord = new CarCostRecord();
				String carNo = "";
				String costTypeName = "";
				String distance = "";
				String driver = "";
				String sumPrice = "";
				carNo = obj[0].toString();
				carCostRecord.setCostComment(carNo);
				if (obj[2] != null) {
					costTypeName = obj[2].toString();
					carCostRecord.setTypeName(costTypeName);
				} else {
					carCostRecord.setTypeName("");
				}

				if (obj[6] != null) {
					distance = obj[6].toString();
					carCostRecord.setItemQty(Float.valueOf(distance));
				} else {
					carCostRecord.setItemQty(0F);
				}
				if (obj[4] != null) {
					driver = obj[4].toString();
					carCostRecord.setCreateUser(driver);
				} else {
					carCostRecord.setCreateUser("");
				}
				if (obj[5] != null) {
					sumPrice = obj[5].toString();
					carCostRecord.setTotalAmt(Float.valueOf(sumPrice));
				} else {
					carCostRecord.setTotalAmt(0F);
				}

				list.add(carCostRecord);
			
			}
		}
		return list;
	}

}
