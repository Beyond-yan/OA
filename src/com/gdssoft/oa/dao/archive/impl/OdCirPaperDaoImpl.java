package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.OdCirPaperDao;
import com.gdssoft.oa.model.archive.OdCirPaper;

@SuppressWarnings("unchecked")
public class OdCirPaperDaoImpl extends BaseDaoImpl<OdCirPaper> implements OdCirPaperDao{

	public OdCirPaperDaoImpl() {
		super(OdCirPaper.class);
	}

	public List<OdCirPaper> searchBySender(Long senderUserId, String subject,
			String senderName, String recName, String isRead, PagingBean pb) {
		System.out.println("-------------senderUserId------11111111------"+senderUserId);
		List<OdCirPaper> resultList = new ArrayList();
		//根据登录人ID查询登录人发起的或收到的传阅记录
		String newhql;
//    	newhql = "select distinct  ocp.cirPaperId,ocp.subject from OdCirPaper ocp inner join OdCirUser ocu2 where ocu2.sendUser.userId=? or ocu2.recUser.userId=?";

    	//newhql = "select distinct  ocp.cirPaperId,ocp.subject from OdCirPaper ocp join OdCirUser ocu2 on ocp.cirPaperId=ocu2.odCirPaper.cirPaperId where ocu2.sendUser.userId=? or ocu2.recUser.userId=?";
//		newhql = "select distinct  ocu2.odCirPaper.cirPaperId,ocu2.odCirPaper.subject  from OdCirUser ocu2 where ocu2.sendUser.userId=? or ocu2.recUser.userId=? ";
		newhql = "select ocp1 from OdCirPaper ocp1 where ocp1.cirPaperId in(select distinct  ocu2.odCirPaper.cirPaperId from OdCirUser ocu2 where ocu2.sendUser.userId=? or ocu2.recUser.userId=? ";
			
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
			newhql = newhql + ") order by ocp1.cirPaperId desc";
			System.out.println("-------------newhql------22222222------"+newhql);
			resultList = findByHql(newhql, paramList.toArray(), pb);
//		}
		return resultList;
	}
	
	
	
}