package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.archive.ArchivesDocExtDao;
import com.gdssoft.oa.model.archive.ArchivesDocExt;

public class ArchivesDocExtDaoImpl extends BaseDaoImpl<ArchivesDocExt> implements ArchivesDocExtDao{

	public ArchivesDocExtDaoImpl() {
		super(ArchivesDocExt.class);
	}

	@Override
	public List<ArchivesDocExt> findByAid(Long archivesId) {
		String hql="from ArchivesDocExt vo where vo.archives.archivesId=?";
		Object [] objs={archivesId};
		return findByHql(hql, objs);
	}
	public List<ArchivesDocExt> findByArchivesId(String hostUrl,Long archivesId,String schema) {
		String sql = "select ad.DOCID,ad.DOCNAME,ad.DOCPATH,ad.CURVERSION,ad.CREATOR from " + schema+".ARCHIVES_DOC_EXT ad where ad.ARCHIVESID="+archivesId;
		Query q = this.getSession().createSQLQuery(sql);
		List list = q.list();
		List<ArchivesDocExt> archivesDocs=new ArrayList<ArchivesDocExt>();
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			ArchivesDocExt archivesDoc = new ArchivesDocExt();
			archivesDoc.setDocId(new Long(objs[0].toString()));
			archivesDoc.setDocName(objs[1].toString());
			archivesDoc.setDocPath(hostUrl+objs[2].toString());
			archivesDoc.setCurVersion(new Integer(objs[3].toString()));
			//archivesDoc.setCreator(objs[4].toString());
			archivesDocs.add(archivesDoc);
		}
		return archivesDocs;
	}

	@Override
	public List getDocByArchivesId(String schemaCode, Long archivesId) {
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode + ".";
		String sql = "select FileId from " + schemaCode + "archives_doc_ext where archivesId = :archivesId";
		Query query = this.getSession().createSQLQuery(sql).setParameter("archivesId", archivesId);
		List list = query.list();
		return list;
	}
}