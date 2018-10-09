package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;

import com.gdssoft.oa.dao.communicate.OutMailDao;
import com.gdssoft.oa.model.communicate.OutMail;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class OutMailDaoImpl extends BaseDaoImpl<OutMail> implements OutMailDao{

	public OutMailDaoImpl() {
		super(OutMail.class);
	}
	public List<OutMail> findByFolderId(Long folderId){
		String hql = "from OutMail where folderId = ?";
		return findByHql(hql, new Object[]{folderId});
	}
	
	@Override
	public Long CountByFolderId(Long folderId) {
		String hql = "select count(*) from OutMail where folderId =?";
		
		Object count=findUnique(hql, new Object[]{folderId});
		
		return new Long(count.toString());
	}
	@Override
	public Map getUidByUserId(Long userId){
		String hql = "select om.uid from OutMail om where om.userId =?";
		List<String> uidList=(List)findByHql(hql, new Object[]{userId});
		
		Map uidMap = new HashMap();
		for(String uid:uidList){
			uidMap.put(uid, "Y");
		}
		
		return uidMap;
	}
	
}