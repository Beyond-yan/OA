package com.gdssoft.oa.action.archive;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

/**
 * 
 * @author
 * 
 */
public class DocumentHandlerAction extends BaseAction {

	@Resource
	private ArchivesService archivesService;

	@Resource
	private ProcessFormService processFormService;
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private AppUserService appUserService;
	private Archives archives;

	public ArchivesService getArchivesService() {
		return archivesService;
	}

	public void setArchivesService(ArchivesService archivesService) {
		this.archivesService = archivesService;
	}

	public Archives getArchives() {
		return archives;
	}

	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	private Configuration configuration = null;

	private Set archive;

	public DocumentHandlerAction() {
		configuration = new Configuration();
		configuration.setDefaultEncoding("UTF-8");
	}

	public String createDoc() {
		Map dataMap = new HashMap();
		getData(dataMap);
		configuration.setClassForTemplateLoading(this.getClass(),
				"/com/gdssoft/test/out");
		Template t = null;
		try {
			t = configuration.getTemplate("draft.ftl");
		} catch (IOException e) {
			e.printStackTrace();
		}
		// this.getSession().getServletContext().getRealPath(arg0)
		String random = java.util.UUID.randomUUID().toString()
				.replaceAll("-", "");
		File outFile = new File(getSession().getServletContext().getRealPath(
				"downFile" + "/" + random + ".doc"));
		String inFile = null;
		inFile = "downFile" + "/" + random + ".doc";
		Writer out = null;
		try {
			try {
				out = new BufferedWriter(new OutputStreamWriter(
						new FileOutputStream(outFile), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}

		} catch (FileNotFoundException el) {
			el.printStackTrace();
		}
		try {
			t.process(dataMap, out);
		} catch (TemplateException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		StringBuffer sb = new StringBuffer("{success:true,data:'");
		sb.append(inFile + "'");
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	private String getData(Map<String, Object> dataMap) {
		String archiveId = getRequest().getParameter("archiveId");
		Archives arch = new Archives();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		if (StringUtils.isNotEmpty(archiveId) && archiveId.indexOf("$") == -1) {
			arch = archivesService.get(new Long(archiveId));
		}
		Map<String, List<ProcessForm>> processFormMap = null;
		if (null != arch) {
			Long runId = arch.getProcessRun().getRunId();
			processFormMap = processFormService.getProcessFormDetail(runId);
		}
		if (null != processFormMap.get("签发")) {
			List<ProcessForm> qf = (List<ProcessForm>) processFormMap.get("签发");
			for (ProcessForm pf : qf) {
				dataMap.put("qfcreatorname", pf.getCreatorName());
				dataMap.put("qfcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("qfcomments", "");
				if (null != pf.getComments())
					dataMap.put("qfcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("中心领导签发")) {
			List<ProcessForm> qf = (List<ProcessForm>) processFormMap
					.get("中心领导签发");
			for (ProcessForm pf : qf) {
				dataMap.put("qfcreatorname", pf.getCreatorName());
				dataMap.put("qfcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("qfcomments", "");
				if (null != pf.getComments())
					dataMap.put("qfcomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("中心领导签发")
				&& null == processFormMap.get("签发")) {
			dataMap.put("qfcreatorname", "");
			dataMap.put("qfcreattime", "");
			dataMap.put("qfcomments", "");
		}
		if (null != processFormMap.get("委属单位领导签发")) {
			List<ProcessForm> qf = (List<ProcessForm>) processFormMap
					.get("委属单位领导签发");
			for (ProcessForm pf : qf) {
				dataMap.put("wsqfcreatorname", pf.getCreatorName());
				dataMap.put("wsqfcreattime",
						formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("wsqfcomments", "");
				if (null != pf.getComments())
					dataMap.put("wsqfcomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("委属单位领导签发")) {
			dataMap.put("wsqfcreatorname", "");
			dataMap.put("wsqfcreattime", "");
			dataMap.put("wsqfcomments", "");
		}
		if (null != processFormMap.get("处室初核")) {
			List<ProcessForm> hg = (List<ProcessForm>) processFormMap
					.get("处室初核");
			for (ProcessForm pf : hg) {
				dataMap.put("hgcreatorname", pf.getCreatorName());
				dataMap.put("hgcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("hgcomments", "");
				if (null != pf.getComments())
					dataMap.put("hgcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("处室核稿")) {
			List<ProcessForm> hg = (List<ProcessForm>) processFormMap
					.get("处室核稿");
			for (ProcessForm pf : hg) {
				dataMap.put("hgcreatorname", pf.getCreatorName());
				dataMap.put("hgcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("hgcomments", "");
				if (null != pf.getComments())
					dataMap.put("hgcomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("处室初核")
				&& null == processFormMap.get("处室核稿")) {
			dataMap.put("hgcreatorname", "");
			dataMap.put("hgcreattime", "");
			dataMap.put("hgcomments", "");
		}
		if (null != processFormMap.get("领导会签")) {
			List<ProcessForm> ldhq = (List<ProcessForm>) processFormMap
					.get("领导会签");
			for (ProcessForm pf : ldhq) {
				dataMap.put("ldhqcreatorname", pf.getCreatorName());
				dataMap.put("ldhqcreattime",
						formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("ldhqcomments", "");
				if (null != pf.getComments())
					dataMap.put("ldhqcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("中心领导会签")) {
			List<ProcessForm> ldhq = (List<ProcessForm>) processFormMap
					.get("中心领导会签");
			for (ProcessForm pf : ldhq) {
				dataMap.put("ldhqcreatorname", pf.getCreatorName());
				dataMap.put("ldhqcreattime",
						formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("ldhqcomments", "");
				if (null != pf.getComments())
					dataMap.put("ldhqcomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("领导会签")
				&& null == processFormMap.get("中心领导会签")) {
			dataMap.put("ldhqcreatorname", "");
			dataMap.put("ldhqcreattime", "");
			dataMap.put("ldhqcomments", "");
		}
		if (null != processFormMap.get("会签")) {

			List<ProcessForm> sh = (List<ProcessForm>) processFormMap.get("会签");
			String hqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					hqcreatorname += "     " + pf.getCreatorName()
							+ "     " + formatter.format(pf.getCreatetime())
							+ "\r                                          ";
				if (null != pf.getComments())
					hqcreatorname += pf.getComments() + "\r                                                     "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                          ";
			}
			dataMap.put("hqcreatorname", hqcreatorname);
		}
		if (null != processFormMap.get("处室会签(部门发起)")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("处室会签(部门发起)");
			String hqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					hqcreatorname += "           " + pf.getCreatorName()
							+ "     " + formatter.format(pf.getCreatetime())
							+ "\r                                                   ";
				if (null != pf.getComments())
					hqcreatorname += pf.getComments() + "\r                                                      "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                                     ";
			}
			dataMap.put("hqcreatorname", hqcreatorname);
		}
		if (null != processFormMap.get("处室会签(办公室发起)")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("处室会签(办公室发起)");
			String hqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					hqcreatorname += "           " + pf.getCreatorName()
							+ "     " + formatter.format(pf.getCreatetime())
							+ "\r                                                  ";
				if (null != pf.getComments())
					hqcreatorname += pf.getComments() + "\r                                                         "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                                  ";
			}
			dataMap.put("hqcreatorname", hqcreatorname);
		}
		if (null != processFormMap.get("处室会签")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("处室会签");
			String hqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					hqcreatorname += "           " + pf.getCreatorName()
							+ "     " + formatter.format(pf.getCreatetime())
							+ "\r                                                      ";
				if (null != pf.getComments())
					hqcreatorname += pf.getComments() + "\r                                                                "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                                     ";
			}
			dataMap.put("hqcreatorname", hqcreatorname);
		}
		if (null != processFormMap.get("交委处室会签")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("交委处室会签");
			String hqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					hqcreatorname += "           " + pf.getCreatorName()
							+ "     " + formatter.format(pf.getCreatetime())
							+ "\r                                                 ";
				if (null != pf.getComments())
					hqcreatorname += pf.getComments() + "\r                                                               "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                                           ";
			}
			dataMap.put("hqcreatorname", hqcreatorname);
		}
		if (null == processFormMap.get("会签")
				&& null == processFormMap.get("处室会签(部门发起)")
				&& null == processFormMap.get("处室会签(办公室发起)")
				&& null == processFormMap.get("处室会签")
				&& null == processFormMap.get("中心领导会签")
				&& null == processFormMap.get("交委处室会签")) {
			dataMap.put("hqcreatorname", "");
		}
		if (null != processFormMap.get("办公室审核")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("办公室审核");
			for (ProcessForm pf : sh) {
				dataMap.put("shcreatorname", pf.getCreatorName());
				dataMap.put("shcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("shcomments", "");
				if (null != pf.getComments())
					dataMap.put("shcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("中心行政办审核")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("中心行政办审核");
			for (ProcessForm pf : sh) {
				dataMap.put("shcreatorname", pf.getCreatorName());
				dataMap.put("shcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("shcomments", "");
				if (null != pf.getComments())
					dataMap.put("shcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("综合办公室审核")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("综合办公室审核");
			for (ProcessForm pf : sh) {
				dataMap.put("shcreatorname", pf.getCreatorName());
				dataMap.put("shcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("shcomments", "");
				if (null != pf.getComments())
					dataMap.put("shcomments", pf.getComments());
			}
		}
		if (null != processFormMap.get("交委办公室审核")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("交委办公室审核");
			for (ProcessForm pf : sh) {
				dataMap.put("shcreatorname", pf.getCreatorName());
				dataMap.put("shcreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("shcomments", "");
				if (null != pf.getComments())
					dataMap.put("shcomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("办公室审核")
				&& null == processFormMap.get("中心行政办审核")
				&& null == processFormMap.get("综合办公室审核")
				&& null == processFormMap.get("交委办公室审核")) {
			dataMap.put("shcreatorname", "");
			dataMap.put("shcreattime", "");
			dataMap.put("shcomments", "");
		}
		if (null != processFormMap.get("委属单位办公室审核")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("委属单位办公室审核");
			for (ProcessForm pf : sh) {
				dataMap.put("wscreatorname", pf.getCreatorName());
				dataMap.put("wscreattime", formatter.format(pf.getCreatetime()));
				if (null == pf.getComments())
					dataMap.put("wscomments", "");
				if (null != pf.getComments())
					dataMap.put("wscomments", pf.getComments());
			}
		}
		if (null == processFormMap.get("委属单位办公室审核")) {
			dataMap.put("wscreatorname", "");
			dataMap.put("wscreattime", "");
			dataMap.put("wscomments", "");
		}
		if (null != processFormMap.get("委属单位处室会签")) {
			List<ProcessForm> sh = (List<ProcessForm>) processFormMap
					.get("委属单位处室会签");
			String wshqcreatorname = "";
			for (ProcessForm pf : sh) {
				if (null == pf.getComments())
					wshqcreatorname += "    " + pf.getCreatorName()
							+ " " + formatter.format(pf.getCreatetime())
							+ "\r                                                    ";
				if (null != pf.getComments())
					wshqcreatorname += pf.getComments() + "\r                                                           "
							+ pf.getCreatorName() + "  "
							+ formatter.format(pf.getCreatetime())
							+ "\r                                                     ";
			}
			dataMap.put("wshqcreatorname", wshqcreatorname);
		}
		if (null == processFormMap.get("委属单位处室会签")) {
			dataMap.put("wshqcreatorname", "");
		}
		String defId = getRequest().getParameter("defId");
		ProDefinition prodef = new ProDefinition();
		if (null != defId && "" != defId.trim() && !defId.trim().isEmpty()) {
			prodef = proDefinitionService.get(new Long(defId));
		}
		dataMap.put("name", prodef.getName());// 稿件名称
		// for ArrayList<FileAttach> faList
		/*
		 * String fileIds = getRequest().getParameter("fileIds"); String
		 * fileName = "";// ---------------定义一个字符串---------------- if
		 * (!fileIds.trim().isEmpty() && !"".equals(fileIds)) {
		 * ArrayList<FileAttach> faList = new ArrayList<FileAttach>(); for
		 * (String fileId : fileIds.split(",")) { FileAttach fa =
		 * fileAttachService.get(new Long(fileIds)); if (fa != null) { fileName
		 * = fa.getFileName();// -------第一步-------- } } }
		 */
		if (arch.getArchivesFiles().size() > 0) {
			Iterator it = arch.getArchivesFiles().iterator();
			while (it.hasNext()) {
				FileAttach archFile = (FileAttach) it.next();
				dataMap.put("archfile", archFile.getFileName());
			}
		} else
			dataMap.put("archfile", "");
		if (null != arch.getEnclosure())
			dataMap.put("enclosure", arch.getEnclosure());// 无文档附件名称
		else
			dataMap.put("enclosure", "");
		AppUser issUser = new AppUser();
		if (arch.getIssuerId() != null) {
			issUser = appUserService.get(arch.getIssuerId());
		}
		if (null != issUser.getDepartment()) {
			dataMap.put("issUser", issUser.getDepartment().getDepName());
		}// 拟稿部门
		if (null != arch.getSubject()) {
			dataMap.put("subject", arch.getSubject());
		}// 标题
		else
			dataMap.put("subject", "");// 标题
		if ("0".equals(arch.getArchivesNo()))
			dataMap.put("archiveno", "未生成编号");
		else
			dataMap.put("archiveno", arch.getArchivesNo());// 发文字号
		if (null != arch.getUrgentLevel())
			dataMap.put("urgentlevel", arch.getUrgentLevel());// 紧急程度..
		else
			dataMap.put("urgentlevel", "");
		if (null != arch.getPrivacyLevel())
			dataMap.put("privacylevel", arch.getPrivacyLevel());// 密急程度..
		else
			dataMap.put("privacylevel", "");
		if (null != arch.getSendTo())
			dataMap.put("sendto", arch.getSendTo());// 主送
		else
			dataMap.put("sendto", "");
		if (null != arch.getCcTo())
			dataMap.put("ccto", arch.getCcTo());// 抄送
		else
			dataMap.put("ccto", "");
		if (null != arch.getIssuer())
			dataMap.put("issur", arch.getIssuer());// 拟稿
		else
			dataMap.put("issur", "");
		String archDepName = "";
		if (arch.getIssuerId() != null) {
			archDepName = appUserService.getArchivesDep(arch.getIssuerId());
			dataMap.put("orgdepname", archDepName);
		} // 拟稿单位
		else {
			dataMap.put("orgdepname", "");
		}
		if (null != arch.getIssueDep())
			dataMap.put("issuedep", arch.getIssueDep());// 发文单位
		else
			dataMap.put("issuedep", "");
		if (null != arch.getFileCounts())
			dataMap.put("filecounts", arch.getFileCounts());// 份数
		else
			dataMap.put("filecounts", "");
		if (null != arch.getArchivesType())
			dataMap.put("typename", arch.getArchivesType().getTypeName());// 文种
		else
			dataMap.put("typename", "");
		if (null != arch.getSources())
			dataMap.put("sources", arch.getSources());// 方向
		else
			dataMap.put("sources", "");
		if (null != arch.getShortContent())
			dataMap.put("shortcontent", arch.getShortContent());// 备注
		else
			dataMap.put("shortcontent", "");
		/*
		 * if(null!=processFormMap) dataMap.put("processFormMap",
		 * processFormMap);
		 */
		return SUCCESS;

	}

}
