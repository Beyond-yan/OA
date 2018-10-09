package com.gdssoft.oa.dao.archive.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.OdCirUserDao;
import com.gdssoft.oa.model.archive.OdCirUser;

@SuppressWarnings("unchecked")
public class OdCirUserDaoImpl extends BaseDaoImpl<OdCirUser> implements
		OdCirUserDao {

	public OdCirUserDaoImpl() {
		super(OdCirUser.class);
	}

	@Override
	public List<OdCirUser> getListByCirPaperId(Long cirPaperId) {
		// TODO Auto-generated method stub
		final String hql = "from OdCirUser o where o.odCirPaper.cirPaperId=?";
		Object[] params = {cirPaperId};
		return findByHql(hql, params);
	}

	public Long getRunIdByTadkId(Long taskId) {
		// TODO Auto-generated method stub
		String sql = "select runId from process_run pr join JBPM4_TASK jt on pr.piId=jt.EXECUTION_ID_ "
				+ "where jt.DBID_=" + taskId;
		return this.jdbcTemplate.queryForLong(sql);
	}

	public List<Long> getByUserAndRun(Long runId, Long userId) {
		// TODO Auto-generated method stub
//		String sql = "select CIR_USER_ID from OD_CIR_USER where PROCESS_RUN_ID=? and REC_USER_ID=?";
		System.out.println("-------------runId------11111111------"+runId);
		System.out.println("-------------userId------11111111------"+userId);
		String sql = "SELECT DISTINCT CIR_USER_ID FROM OD_CIR_USER "+
					 "WHERE CIR_USER_ID IN (" +
					 	"SELECT ocu1.CIR_USER_ID FROM OD_CIR_USER ocu1 "+
					 	"WHERE ocu1.PROCESS_RUN_ID = ? AND ocu1.REC_USER_ID = ? "+
                        "UNION ALL "+
                        "SELECT ocu2.CIR_USER_ID FROM OD_CIR_USER ocu2 "+
                        "join process_run pr on ocu2.PROCESS_RUN_ID = pr.runId "+
                        "join JBPM4_TASK jt on jt.EXECUTION_ID_ = pr.piId "+
                        "JOIN Task_Agent ta ON ta.TASK_ID=jt.DBID_ "+
                        "where ocu2.PROCESS_RUN_ID=?  and ta.TO_USER_ID=? " +
                      //  "and ocu2.REC_USER_ID=ta.FROM_USER_ID "+
                        "UNION ALL "+
                        "SELECT ocu3.CIR_USER_ID FROM OD_CIR_USER ocu3 "+
                        "join user_agent ua on ua.userId=ocu3.REC_USER_ID "+
                        "where ocu3.PROCESS_RUN_ID=? and ua.grantUId=? "+
                     ")";
		Object[] params = { runId, userId,runId, userId,runId, userId };
		return this.jdbcTemplate.queryForList(sql, params,Long.class);
	}

	
	public List<OdCirUser> searchBySender(Long senderUserId, String subject,
			String senderName, String recName, String isRead, PagingBean pb) {
		System.out.println("-------------senderUserId------11111111------"+senderUserId);
		List<OdCirUser> resultList = new ArrayList();
		//根据登录人ID查询登录人发起的或收到的传阅记录
//		String hql = "select distinct o from  OdCirUser o where o.sendUser.userId=? or o.recUser.userId=?";
//		Object[] params = { senderUserId, senderUserId};
//		List<OdCirUser> parList = findByHql(hql, params);
		String newhql;
//		if (!parList.isEmpty() && parList.size() > 0) {
//			newhql = "from OdCirUser ocu where ocu.cirUserId in ( select distinct ocu2.cirUserId from OdCirUser ocu2 ";
			newhql = "select ocu from OdCirUser ocu where ocu.odCirPaper.cirPaperId in(select distinct  ocu2.odCirPaper.cirPaperId from OdCirUser ocu2 where ocu2.sendUser.userId=? or ocu2.recUser.userId=? ";
			ArrayList<Object> paramList = new ArrayList<Object>();
			paramList.add(senderUserId);
			paramList.add(senderUserId);

			if (subject != null && subject != "") {
				newhql = newhql + " and ocu2.odCirPaper.subject like ?";
				paramList.add("%" + subject + "%");
			}
			if (senderName != null && senderName != "") {
				newhql = newhql + " and ocu2.sendUser.fullname like ?";
				paramList.add("%" + senderName + "%");
			}
			if (recName != null && recName != "") {
				newhql = newhql + " and ocu2.recUser.fullname like ?";
				paramList.add("%" + recName + "%");
			}
			if (isRead != null && isRead != "" && !(isRead.equals("2"))&& !(isRead.equals("请选择"))) {
				newhql = newhql + " and ocu2.isRead =" + isRead;
			}
			System.out.println("-------------newhql------11111111------"+newhql);		
//			newhql = newhql + " order by ocu2.path desc,ocu2.isRead,ocu2.readDate";
			newhql = newhql + ") order by ocu.odCirPaper.cirPaperId desc";
			System.out.println("-------------newhql------22222222------"+newhql);
			resultList = findByHql(newhql, paramList.toArray(), pb);
//		}
		return resultList;
	}
	

	public List<OdCirUser> searchByPaperId(Long senderUserId,Long cirPaperId, PagingBean pb) {
		System.out.println("-------------cirPaperId-------"+cirPaperId);
		List<OdCirUser> resultList = new ArrayList();
		//根据登录人ID查询登录人发起的或收到的传阅记录
		System.out.println("-------------senderUserId-----------"+senderUserId);
		System.out.println("-------------cirPaperId-----------"+cirPaperId);
		logger.debug("sendUserId:"+senderUserId);
		  String newhql;
			newhql = "select distinct  ocu2  from OdCirUser ocu2 where (ocu2.sendUser.userId=? or ocu2.recUser.userId=?)  and  ocu2.odCirPaper.cirPaperId=?";
			ArrayList<Object> paramList = new ArrayList<Object>();
			paramList.add(senderUserId);
			paramList.add(senderUserId);	
			paramList.add(cirPaperId);
			newhql = newhql + " order by ocu2.path desc,ocu2.isRead,ocu2.readDate";
			System.out.println("-------------newhql------22222222------"+newhql);
			resultList = findByHql(newhql, paramList.toArray(), pb);
		return resultList;
	}


}
