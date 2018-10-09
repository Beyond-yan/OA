package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.admin.CarCardHistoryDao;
import com.gdssoft.oa.model.admin.CarCardHistory;
@SuppressWarnings("unchecked")
public class CarCardHistoryDaoImpl extends BaseDaoImpl<CarCardHistory> implements CarCardHistoryDao{

	public CarCardHistoryDaoImpl() {
		super(CarCardHistory.class);
	}
	
	
	public  List findByCon(String cardType,String cardNum,String consumeType,String orderby,PagingBean pb)
	{
		String countSql = "";		
		countSql = " select count(*) ";
		countSql += "from CAR_CARD_HISTORY his join {TABLE} oc ";
		countSql += "on his.CARD_ID = oc.ID and his.CARD_TYPE = {CARD_TYPE} ";
		countSql += "where oc.SN like '%{CARDNUM}%' and  his.USE_TYPE =  {CONSUMETYPE}" ;
		
	
		
		Integer thePage = pb.start ;
		
		logger.debug("thePage: " + thePage);
		
		String sql = "";
		sql += " SELECT TOP {PAGESIZE} * FROM  ";
		sql += " ( ";
		sql += "  SELECT his.ID,oc.SN,his.AMOUNT, his.CARD_TYPE, convert(varchar(10),his.USE_DATE,120) as USE_DATE , his.USE_TYPE, his.DESCRIPTION ";
		sql += "   FROM CAR_CARD_HISTORY his ";
		sql += "   JOIN {TABLE} oc ";
		sql += "   ON his.CARD_ID = oc.ID AND his.CARD_TYPE = {CARD_TYPE} ";
		sql += "   WHERE oc.SN LIKE '%{CARDNUM}%' AND his.USE_TYPE = {CONSUMETYPE}    ";
		sql += " ) tg   ";
		sql += " WHERE tg.ID NOT IN  ";
		sql += " 	( ";
		sql += "  SELECT TOP {THEPAGE} his.ID ";
		sql += "   FROM CAR_CARD_HISTORY his ";
		sql += "  JOIN {TABLE} oc ";
		sql += "  ON his.CARD_ID = oc.ID AND his.CARD_TYPE = {CARD_TYPE} ";
		sql += "  WHERE oc.SN LIKE '%{CARDNUM}%' AND his.USE_TYPE = {CONSUMETYPE}  ";
		sql += "  order by  {ORBERBY}  ";
		sql += " ) ";
		sql += " order by {ORBERBY}  ";
		
		if(cardType.equals("1"))
		{
			countSql= countSql.replace("{TABLE}", "CAR_OIL_CARD");
			sql = sql.replace("{TABLE}", "CAR_OIL_CARD");
		}
		else	
		{
			countSql= countSql.replace("{TABLE}", "CAR_PASS_FEE_CARD");
			sql = sql.replace("{TABLE}", "CAR_PASS_FEE_CARD");
		}

		sql = sql.replace("{ORBERBY}", orderby);
		sql = sql.replace("{PAGESIZE}", pb.getPageSize().toString());
		sql = sql.replace("{THEPAGE}", thePage.toString()); 
		sql = sql.replace("{CARDNUM}", cardNum).replace("{CONSUMETYPE}", consumeType).replace("{CARD_TYPE}", cardType);
		countSql = countSql.replace("{CARDNUM}", cardNum).replace("{CONSUMETYPE}", consumeType).replace("{CARD_TYPE}", cardType);
		
		logger.debug(countSql);
		logger.debug(sql);
		
		pb.setTotalItems(jdbcTemplate.queryForInt(countSql));		

		return jdbcTemplate.queryForList(sql);
	}
}