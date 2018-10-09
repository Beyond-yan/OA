package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.OdCommonCommentsDao;
import com.gdssoft.oa.model.archive.OdCommonComments;

@SuppressWarnings("unchecked")
public class OdCommonCommentsDaoImpl extends BaseDaoImpl<OdCommonComments> implements OdCommonCommentsDao{

	public OdCommonCommentsDaoImpl() {
		super(OdCommonComments.class);
	}

	public List<OdCommonComments>  getCommentsForSelector(Long userId,String commentType,String commentTitle,PagingBean pb){
		if(commentTitle==null||commentTitle.equals("")){
			String hql = "select od from OdCommonComments od where ((od.appUser.userId=? and od.commentType=0) or (od.commentType=1)) and (ref1=? or ref1 is null) order by od.id desc";
			Object[] objs = { userId,commentType};
			if(commentType!=null&&!"".equals(commentType)&&!"true".equals(commentType)&&new Integer(commentType).intValue()>2){
				hql = "select od from OdCommonComments od where ref1=? order by od.id asc";
				objs = new Object[]{commentType};
			}
			return findByHql(hql, objs, pb);
		}else{
			commentTitle='%'+commentTitle+'%';
			String hql = "select od from OdCommonComments od where ((od.appUser.userId=? and od.commentType=0) or (od.commentType=1)) and (ref1=? or ref1 is null) and od.commentTitle like '%'+?+'%' order by od.id desc";
			Object[] objs = { userId,commentType,commentTitle};
			if(commentType!=null&&!"".equals(commentType)&&!"true".equals(commentType)&&new Integer(commentType).intValue()>2){
				hql = "select od from OdCommonComments od where ref1=? and od.commentTitle like ? order by od.id asc";
				objs = new Object[]{commentType,commentTitle};
			}
			return findByHql(hql, objs, pb);
		}
	}
}