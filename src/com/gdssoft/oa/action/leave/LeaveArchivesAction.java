package com.gdssoft.oa.action.leave;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFCellUtil;
import org.apache.poi.hssf.util.Region;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.PrintSetup;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.struts2.ServletActionContext;
import org.jbpm.api.ProcessInstance;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.DocHistory;
import com.gdssoft.oa.model.archive.OdFlowtype;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.archive.DocHistoryService;
import com.gdssoft.oa.service.flow.FlowTaskReportService;
import com.gdssoft.oa.service.flow.FormDataService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.util.ArchiveNoGenerator;
import com.gdssoft.oa.util.StringUtil;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class LeaveArchivesAction extends BaseAction {
	private ProcessRun processRun;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	private FormDataService formDataService;

	@Resource
	private ArchivesService archivesService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private ArchivesDocService archivesDocService;
	@Resource
	private DocHistoryService docHistoryService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ArchivesDepService archivesDepService;
	@Resource
	private FlowTaskReportService flowTaskReportService;
	
	private Archives archives;
	private Long archivesId;
	private Long runId;

	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	public ProcessRun getProcessRun() {
		return processRun;
	}

	public void setProcessRun(ProcessRun processRun) {
		this.processRun = processRun;
	}
	// private Map<String,String> depIdNameMap = new HashMap<String,String>();

	public Long getArchivesId() {
		return archivesId;
	}

	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}

	public Archives getArchives() {
		return archives;
	}

	public void setArchives(Archives archives) {
		this.archives = archives;
	}

	/**
	 * 办结，更新状态为2
	 */
	public String updateStatus() {
		Archives archives = archivesService.get(archivesId);
		String status=getRequest().getParameter("status");
		archives.setStatus(Short.parseShort(status));
		archives = archivesService.save(archives);
		return SUCCESS;
	}
	/**
	 * 督办安排，添加是否回复
	 */
	public String updateReply() {
		Archives archives = archivesService.get(archivesId);
		String reply=getRequest().getParameter("reply");
		archives.setArchChecker(reply);
		archives = archivesService.save(archives);
		return SUCCESS;
	}
	public String updatePublic() {
		Archives archives = archivesService.get(archivesId);
		String isPublic=getRequest().getParameter("isPublic");
		Short s=new Short(isPublic);
		archives.setIsPublic(s);
		if(s.intValue()>0){
			archives.setIsShared(1);
		}else{
			archives.setIsShared(0);
		}
		//archives.setIsStandard(new Short(two));
		archives = archivesService.save(archives);
		return SUCCESS;
	}
	/**
	 * 销假，更新销假时间
	 */
	public String updateXiaojiaTime(){
		String handlerUnames=getRequest().getParameter("handlerUnames");
		String receiveDate=getRequest().getParameter("receiveDate");
		String day=getRequest().getParameter("day");
		Archives archives = archivesService.get(archivesId);
		archives.setSendTo((Integer.parseInt(archives.getSendTo())-Integer.parseInt(day))+"");
		archives.setHandlerUnames(handlerUnames);
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = sdf.parse(receiveDate);
			archives.setSignDate(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		archives = archivesService.save(archives);
		return SUCCESS;
	}
	
	public String getRunIdByArchivesId(){
		Archives archives = archivesService.get(archivesId);
		ProcessRun pr=archives.getProcessRun();
		jsonString="{success:true,runId:"+pr.getRunId()+"}";
		return SUCCESS;
	}
	public String getIspublicByArchivesId(){
		Archives archives = archivesService.get(archivesId);
		jsonString="{success:true,ispublic:"+archives.getIsPublic()+"}";
		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		AppUser appUser = ContextUtil.getCurrentUser();
		String depName=appUser.getDepartment().getDepName();
		if(depName!=null&&(depName.indexOf("组织人事处")==-1&&depName.indexOf("局领导")==-1&&!appUser.getFullname().equals("系统管理员"))){
			filter.addFilter("Q_issueDep_S_EQ", depName);
			if(!appUser.getPosition().equals("处长")&&!appUser.getPosition().equals("副处长")){
				filter.addFilter("Q_issuerId_L_EQ", appUser.getUserId()+"");
			}
		}
		List<Archives> list = archivesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "createtime");
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "issueDate");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String listFlow(){
		QueryFilter filter=new QueryFilter(getRequest());
		String toDoType=getRequest().getParameter("toDoType");
		String archiveType=getRequest().getParameter("archiveType");
		String subject=getRequest().getParameter("subject");
		String depName=getRequest().getParameter("depName");
		String defId=getRequest().getParameter("defId");
		String startDate=getRequest().getParameter("startDate");
		String endDate=getRequest().getParameter("endDate");
		String orgDepId=getRequest().getParameter("orgDepId");
		String archiveNo=getRequest().getParameter("archiveNo");
		String snConfigId =getRequest().getParameter("snConfigId");
		String depSignNo =getRequest().getParameter("depSignNo");
		String issuerName =getRequest().getParameter("issuerName");
		String assignUserName =getRequest().getParameter("assignUserNameSearch");
		String issuerDepId =getRequest().getParameter("issuerDepId");
		int start = Integer.parseInt(getRequest().getParameter("start"));
		int limit = Integer.parseInt(getRequest().getParameter("limit"));
		Long defid = null;
		if(StringUtils.isNotBlank(defId)) defid=new Long(defId);
		Long signId = null;
		if(StringUtils.isNotBlank(snConfigId)) signId=new Long(snConfigId);
		Long issuerDepid = null;
		if(StringUtils.isNotBlank(issuerDepId)) issuerDepid=new Long(issuerDepId);
		Long userId=ContextUtil.getCurrentUserId();
		AppUser appUser = ContextUtil.getCurrentUser();
		String depname=appUser.getDepartment().getDepName();
		if(depname!=null&&(depname.indexOf("组织人事处")!=-1||depname.indexOf("局领导")!=-1)){
			userId=new Long("1");//人事处与局领导查看在办件的权限与系统管理员一样
		}
		List<FlowTaskReport> list= flowTaskReportService.getNewFlowTaskList(userId,Integer.parseInt(toDoType),Integer.parseInt(archiveType), subject, depName, defid, startDate, endDate,start,limit,orgDepId,archiveNo,signId,depSignNo,issuerName,issuerDepid,assignUserName);
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(totalCounts).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"archCreateTime", "sendTime","limitedDate","signDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String getDepName() {
		AppUser currentUser = ContextUtil.getCurrentUser();
		StringBuffer buff = new StringBuffer("{success:true,'depName':'");
		buff.append(currentUser.getDepartment().getDepName());
		buff.append("'}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	
	private InputStream excelStream;  //输入流变量

	public InputStream getExcelStream() {
		return excelStream;
	}
	 
    public void setExcelStream(InputStream excelStream) {
       this.excelStream = excelStream;
    }
    
	private String downloadFileName;

	public void setDownloadFileName(String downloadFileName) {
		this.downloadFileName = downloadFileName;
	}
	//处理下载时  文件名是中文的方法：
    public String getDownloadFileName() {  
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyy-MM-dd ");        
		if(StringUtils.isBlank(downloadFileName))
			downloadFileName= (sf.format(new Date()).toString())+"公文处理情况汇总表.xls";
		try{
			downloadFileName=new String(downloadFileName.getBytes(),"ISO8859-1");
		}catch(UnsupportedEncodingException  e){
			e.printStackTrace();
		}
		return downloadFileName;
    }

	public String listToExcel() {
		QueryFilter filter = new QueryFilter(ServletActionContext.getRequest());
		AppUser appUser = ContextUtil.getCurrentUser();
		String depName=appUser.getDepartment().getDepName();
		if(depName!=null&&(depName.indexOf("组织人事处")==-1&&depName.indexOf("局领导")==-1&&!appUser.getFullname().equals("系统管理员"))){
			filter.addFilter("Q_issueDep_S_EQ", depName);
			if(!appUser.getPosition().equals("处长")&&!appUser.getPosition().equals("副处长")){
				filter.addFilter("Q_issuerId_L_EQ", appUser.getUserId()+"");
			}
		}
		List<Archives> list = archivesService.getAll(filter);
		SimpleDateFormat   sf   =   new SimpleDateFormat( "yyyyMMdd ");   
		downloadFileName= "重庆市港航局请假统计信息" + sf.format(new Date()).toString() + ".xls";
		excelStream = leaveListToExcel(list);
		return "download";
	}
	

	/**
	 * 请假管理
	 */
	public InputStream leaveListToExcel(List<Archives> list){
		HSSFWorkbook[] wbs = new HSSFWorkbook[] { new HSSFWorkbook() };
		InputStream is=null;
		for (int k = 0; k < wbs.length; k++) {
			// 1.新建一个Excel模板
			HSSFWorkbook wb = wbs[k];
			Map<String, CellStyle> styles = createStyles(wb);
			CreationHelper createHelper = wb.getCreationHelper();
			// 2.新建第一个sheet
			HSSFSheet sheet1 = wb.createSheet("sheet1");
			PrintSetup printSetup = sheet1.getPrintSetup();
			printSetup.setLandscape(true);
			sheet1.setFitToPage(true);
			sheet1.setHorizontallyCenter(true);
			// title row
			Row titleRow = sheet1.createRow(0);
			titleRow.setHeightInPoints(45);
			Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("统计信息");
			titleCell.setCellStyle(styles.get("title"));
			sheet1.addMergedRegion(CellRangeAddress.valueOf("$A$1:$H$1"));
			
			Region region= new Region(0, (short)0, 1, (short)7);
			this.setRegionStyle(sheet1, region, styles.get("header"));

			
			
			// header2 row 第2行
			Row headerRow2 = sheet1.createRow(1);
			headerRow2.setHeightInPoints(20);
			Cell headerCell2;
			//第2行  第1列
			headerCell2 = headerRow2.createCell(0);
			headerCell2.setCellValue("休假类别");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(1);
			headerCell2.setCellValue("文件标题");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(2);
			headerCell2.setCellValue("部门");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(3);
			headerCell2.setCellValue("职务");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(4);
			headerCell2.setCellValue("申请人");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(5);
			headerCell2.setCellValue("请假时间");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(6);
			headerCell2.setCellValue("休假天数");
			headerCell2.setCellStyle(styles.get("header"));
			headerCell2 = headerRow2.createCell(7);
			headerCell2.setCellValue("销假时间");
			headerCell2.setCellStyle(styles.get("header"));
			sheet1.setColumnWidth(0, (short)8500);
			sheet1.setColumnWidth(1, (short)12000);
			sheet1.setColumnWidth(2, (short)5000);
			sheet1.setColumnWidth(3, (short)7000);			
			sheet1.setColumnWidth(4, (short)5000);
			sheet1.setColumnWidth(5, (short)5000);
			sheet1.setColumnWidth(6, (short)5000);
			sheet1.setColumnWidth(7, (short)5000);
			Region region2= new Region(1, (short)1, 2, (short)7);
			this.setRegionStyle(sheet1, region2, styles.get("header"));
			
			int rownum = 2;
					
			Cell cell = null;
			for (Archives iter : list) {
				Row row = sheet1.createRow(rownum);
				for (int j = 0; j < 8; j++) {
	                cell = row.createCell(j);
	                if(j==0){
	                	cell.setCellValue(iter.getPrivacyLevel());
	                }else if(j==1){
	                	cell.setCellValue(iter.getSubject());
	                }else if (j==2) {
	                	cell.setCellValue(iter.getIssueDep());
					}else if(j == 3){
	                	cell.setCellValue(iter.getTypeName());
	                }else if(j == 4){
	                	cell.setCellValue(iter.getHandlerUids());
	                }else if(j == 5){
	                	cell.setCellValue(iter.getArchivesNo());
	                }else if(j == 6){	     
	                	cell.setCellValue(iter.getSendTo());
	                }else if(j == 7){
	                	if(null == iter.getHandlerUnames()){
	                		cell.setCellValue("");
	                	}else{
	                		cell.setCellValue(iter.getHandlerUnames());
	                	}
	                }
	                cell.setCellStyle(styles.get("cell"));
	            }
				rownum++;
			}
			
			//sheet1.setColumnWidth(0, (short)50);
			//sheet1.autoSizeColumn(0);
			//使用apache的commons-lang.jar产生随机的字符串作为文件名
	        String fileName=RandomStringUtils.randomAlphanumeric(10);
	        //生成xls文件名必须要是随机的，确保每个线程访问都产生不同的文件
	        StringBuffer sb=new StringBuffer(fileName);

	        final File file = new File(sb.append(".xls").toString()); 
			try {
		        OutputStream os=new FileOutputStream(file);
	            try {
	                 wb.write(os);
	                  os.close();
	            } catch (IOException e) {
	            	e.printStackTrace();
	            }

			} catch (FileNotFoundException e) {
				e.printStackTrace();
			}
			
	       try {
	              is=new FileInputStream(file);
	       } catch (FileNotFoundException e) {
	               e.printStackTrace();
	       }
		}
		 return is;//返回的是一个输入流
	
	}
	/**
	 * Create a library of cell styles
	 */
	private static Map<String, CellStyle> createStyles(Workbook wb) {
		Map<String, CellStyle> styles = new HashMap<String, CellStyle>();
		CellStyle style;
		Font titleFont = wb.createFont();
		titleFont.setFontHeightInPoints((short) 14);
		titleFont.setBoldweight(Font.BOLDWEIGHT_BOLD);
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFont(titleFont);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("title", style);

		Font monthFont = wb.createFont();
		monthFont.setFontHeightInPoints((short) 11);
		//monthFont.setColor(IndexedColors.WHITE.getIndex());
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setFont(monthFont);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("header", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("cell", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00%"));
		styles.put("formula", style);

		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setDataFormat(wb.createDataFormat().getFormat("0.00"));
		styles.put("formula_2", style);
		//第0列样式
		style = wb.createCellStyle();
		style.setAlignment(CellStyle.ALIGN_CENTER);
		style.setFillForegroundColor(IndexedColors.GREY_40_PERCENT.getIndex());
		style.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		style.setWrapText(true);
		style.setBorderRight(CellStyle.BORDER_THIN);
		style.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderLeft(CellStyle.BORDER_THIN);
		style.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderTop(CellStyle.BORDER_THIN);
		style.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style.setBorderBottom(CellStyle.BORDER_THIN);
		style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		styles.put("cell0", style);

		return styles;
	}
	
	private void setRegionStyle(HSSFSheet sheet, Region region , CellStyle cs) {
        int toprowNum = region.getRowFrom();
        for (int i = region.getRowFrom(); i <= region.getRowTo(); i ++) {
            HSSFRow row = HSSFCellUtil.getRow(i, sheet);
            for (int j = region.getColumnFrom(); j <= region.getColumnTo(); j++) {
                HSSFCell cell = HSSFCellUtil.getCell(row, (short)j);
                cell.setCellStyle(cs);
            }
        }
    }

	
	/**
	 * 普通公文save
	 * 
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String saveNormal() {
		// 取当前该附件的所有文档
		String docs = getRequest().getParameter("docs");
		String status = getRequest().getParameter("status");
		String fileIds = getRequest().getParameter("fileIds");
		AppUser curUser = ContextUtil.getCurrentUser();
		Set archivesDocSet = new HashSet();
		if (StringUtils.isNotEmpty(docs)) {
			Gson gson = new GsonBuilder()
					.excludeFieldsWithoutExposeAnnotation()
					.setDateFormat("yyyy-MM-dd HH:mm:ss").create();
			ArchivesDoc[] archivesDocs = gson.fromJson(docs,
					ArchivesDoc[].class);
			if (archivesDocs != null) {
				for (int i = 0; i < archivesDocs.length; i++) {
					if (archivesDocs[i].getDocId() == null
							|| archivesDocs[i].getDocId() == 0) {
						archivesDocs[i].setDocId(null);
						archivesDocs[i].initUsers(curUser);
						archivesDocs[i].setDocStatus(ArchivesDoc.STATUS_MODIFY);
						archivesDocs[i].setUpdatetime(new Date());
						archivesDocs[i].setCreatetime(new Date());
						if(archives.getArchType()!=null&&"1".equals(archives.getArchType().toString())){
							archivesDocs[i].setIsFinish((short) 1);
						}else{
							archivesDocs[i].setIsFinish((short) 0);
						}
						archivesDocs[i].setFileAttach(fileAttachService
								.getByPath(archivesDocs[i].getDocPath()));

						archivesDocs[i].setCurVersion(1);

						archivesDocService.save(archivesDocs[i]);

						// 新增文件同时在历史表增加一历史记录
						DocHistory newHistory = new DocHistory();
						newHistory.setArchivesDoc(archivesDocs[i]);
						newHistory.setFileAttach(archivesDocs[i]
								.getFileAttach());
						newHistory.setDocName(archivesDocs[i].getDocName());
						newHistory.setPath(archivesDocs[i].getDocPath());
						newHistory.setVersion(ArchivesDoc.ORI_VERSION);
						newHistory.setUpdatetime(new Date());
						newHistory.setMender(curUser.getFullname());
						docHistoryService.save(newHistory);
					} else {
						archivesDocs[i] = archivesDocService
								.get(archivesDocs[i].getDocId());
					}
					archivesDocSet.add(archivesDocs[i]);
				}
			}
		}

		Set archivesAttachments = new HashSet();
		if (StringUtils.isNotEmpty(fileIds)) {
			String[] files = fileIds.split(",");
			if (files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					FileAttach fa = fileAttachService.get(Long
							.valueOf(files[i]));
					archivesAttachments.add(fa);
				}
			}
		}
		String ccIds = getRequest().getParameter("ccIds");

		java.util.Set<AppUser> archivesCCs = new java.util.HashSet<AppUser>();
		if (!("".equals(ccIds) || null == ccIds)) {
			String[] ccIdsArray = ccIds.split(",");
			AppUser appUser = new AppUser();
			for (int i = 0; i < ccIdsArray.length; i++) {
				appUser = appUserService.get(new Long(ccIdsArray[i]));
				archivesCCs.add(appUser);
			}
		}
		if (!archivesCCs.isEmpty()) {
			archives.setArchivesCCs(archivesCCs);
		}
		if (archives.getArchivesType()==null||archives.getArchivesType().getTypeId() == null) {//请假管理修改
			// archives.setArchType(Archives.ARCHIVE_TYPE_DISPATCH);
			archives.setArchivesType(null);
		}
		if (archives.getArchType() == null) {
			archives.setArchType(Archives.ARCHIVE_TYPE_DISPATCH);
		}
		// 草稿状态
		if (StringUtils.isNotEmpty(status)) {
			archives.setStatus(Short.parseShort(status));
		} else {
			archives.setStatus(Archives.STATUS_ISSUE);
		}
		archives.setCreatetime(new Date());
		archives.setIssueDate(new Date());

		// TODO count the files here
		if (archives.getFileCounts() == null) {
			archives.setFileCounts(archivesDocSet.size());
		}

		archives.setArchivesDocs(archivesDocSet);
		archives.setArchivesFiles(archivesAttachments);
		archives.setProcessRun(null);
		if (archives.getArchivesNo() == null
				|| "".equals(archives.getArchivesNo())) {
			archives.setArchivesNo("0");
		}
		archives = archivesService.save(archives);
		setJsonString("{success:true,archivesId:'" + archives.getArchivesId()+ "'}");
		return SUCCESS;
	}
	
	/**
	 * 收文添加及保存操作
	 */
	public String save() {
		String arcRecfileIds = getRequest().getParameter("archivesRecfileIds");
		String archDepId = getRequest().getParameter("archDepId");
		String refileId = getRequest().getParameter("fileIds");
		String handlerUids = getRequest().getParameter("signUserIds");
		AppUser appUser = ContextUtil.getCurrentUser();
		List<ArchivesDoc> orgArchDocs = null;
		if (archives.getArchivesId() == null) {
			if (archives.getArchType() == null) {
				archives.setArchType(Archives.ARCHIVE_TYPE_RECEIVE);
			}
			archives.setIssuerId(appUser.getUserId());
			archives.setIssuer(appUser.getFullname());
			archives.setHandlerUids(handlerUids);
			archives.setIssueDate(new Date());
			archives.setCreatetime(new Date());
			archives.setProcessRun(null);
		} else {
			Archives orgArchives = archivesService.get(archives.getArchivesId());
			Set archivesAttachments = new HashSet();
			if (StringUtils.isNotEmpty(refileId)) {
				String[] files = refileId.split(",");
				if (files.length > 0) {
					for (int i = 0; i < files.length; i++) {
						FileAttach fa = fileAttachService.get(Long
								.valueOf(files[i]));
						archivesAttachments.add(fa);
					}
				}
				archives.setArchivesFiles(archivesAttachments);
			}
			orgArchDocs = archivesDocService.findByAid(orgArchives
					.getArchivesId());
			try {
				BeanUtil.copyNotNullProperties(orgArchives, archives);
				archives = orgArchives;
				if (archives.getArchivesType().getTypeId() == null) {
					archives.setArchivesType(null);
				}
				archivesService.save(archives);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}

		// if (StringUtils.isNotEmpty(arcRecfileIds) &&
		// archives.getFileCounts()==null) {
		// archives.setFileCounts(arcRecfileIds.split(",").length);
		// }
		archivesService.save(archives);
		if (StringUtils.isNotEmpty(arcRecfileIds)) {
			List<ArchivesDoc> list = archivesDocService.findByAid(archives
					.getArchivesId());
			for (ArchivesDoc archivesDoc : list) {
				archivesDocService.remove(archivesDoc);
			}
			String[] fileIds = arcRecfileIds.split(",");
			for (String id : fileIds) {
				FileAttach fileAttach = fileAttachService.get(new Long(id));
				ArchivesDoc archivesDoc = new ArchivesDoc();
				archivesDoc.setArchives(archives);
				archivesDoc.setFileAttach(fileAttach);
				archivesDoc.setDocName(fileAttach.getFileName());
				archivesDoc.setDocStatus((short) 1);
				archivesDoc.setCurVersion(1);
				if(archives.getArchType()!=null&&"1".equals(archives.getArchType().toString())){
					archivesDoc.setIsFinish((short) 1);
				}else{
					archivesDoc.setIsFinish((short) 0);
				}
				archivesDoc.setDocPath(fileAttach.getFilePath());
				archivesDoc.setCreatetime(new Date());
				archivesDoc.setUpdatetime(new Date());
				archivesDocService.save(archivesDoc);
			}
		} else {
			for (ArchivesDoc archivesDoc : orgArchDocs) {
				archivesDoc.setArchives(archives);
				archivesDocService.save(archivesDoc);
			}
		}

		// 公文签收后在部门签收公文表中作标记
		if (StringUtils.isNotEmpty(archDepId)) {
			ArchivesDep archivesDep = archivesDepService
					.get(new Long(archDepId));
			archivesDep.setStatus(ArchivesDep.STATUS_SIGNED);
			archivesDepService.save(archivesDep);
		}

		setJsonString("{success:true,archivesId:" + archives.getArchivesId()
				+ "}");
		return SUCCESS;
	}
	/**
	 * 获取上一步变量
	 */
	public String getPreviousStepProcessRun() {
		String taskId  = getRequest().getParameter("taskId");
		StringBuffer sb = null;
		if(StringUtils.isBlank(taskId)) {
			sb = new StringBuffer("{success:false,data:'taskId is null!'}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//获取流程信息
		ProcessInstance pis=jbpmService.getProcessInstanceByTaskId(taskId);
		processRun=processRunService.getByPiId(pis.getId());
		getRequest().setAttribute("processRun", processRun);
		runId=processRun.getRunId();
		
		//获取审批列表
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(100000);
		filter.addFilter("Q_processRun.runId_L_EQ",runId.toString());
		filter.addFilter("Q_type_L_EQ","0");
		filter.addSorted("formId", "ASC");
		List<ProcessForm> pfList=processFormService.getAll(filter);
		//List<ProcessForm> pfList=processFormService.getByRunId(runId);
		if(pfList.size()<2){
			sb = new StringBuffer("{success:false,data:'no previous step!'}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		//获取最后一次非领导批示及退回变量名称
		ProcessForm processForm=pfList.get(1);
	
		sb = new StringBuffer();
		sb.append("{success:true,data:[{activityName:'");
		sb.append(processForm.getActivityName() + "',");
		sb.append("creatorId:'" + processForm.getCreatorId() + "',");
		sb.append("status:'" + processForm.getStatus() + "',");
		//sb.append("comments:'" + processForm.getComments() + "',");
		sb.append("signalName:'to " + processForm.getActivityName() + "',");
		sb.append("processRunId:'" + processForm.getProcessRun().getRunId()+"'");
		sb.append("}]}");
		return SUCCESS;
	}
	
	public String getArchData() {
		Archives archives = archivesService.get(archivesId);
		if (archives.getArchivesType() == null) {
			archives.setArchivesType(null);
			archives.setParentArchId(null);
		} else {
			archives.setParentArchId(archives.getArchivesType().getTypeId());
		}
		if (archives.getIsStandard() == null) {
			archives.setIsStandard((short) -1);
		}
		if (archives.getIsPublic() == null) {
			archives.setIsPublic((short) -1);
		}
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		// JSONSerializer json = new JSONSerializer();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,runId:"+archives.getProcessRun().getRunId()+",data:[");
		sb.append(gson.toJson(archives));
		// sb.append(json.serialize(archives));
		sb.deleteCharAt(sb.length() - 1);
		sb.append("}");
		sb.append("]}");
		setJsonString(sb.toString());

		return SUCCESS;
	}	
	
	public String updateProcessRunSubject() {
		String archivesId  = getRequest().getParameter("archivesId");
		Archives orgArchives = archivesService.get(Long.valueOf(archivesId));
		String runId  = getRequest().getParameter("runId");
		ProcessRun processRun=processRunService.get(Long.valueOf(runId));
		processRun.setSubject(orgArchives.getSubject());
		processRunService.save(processRun);
		orgArchives.setProcessRun(processRun);
		archivesService.save(orgArchives);
		return SUCCESS;
	}
	

	/**
	 * 收文添加及保存操作
	 */
	public String saveAgain() {
		Archives orgArchives = archivesService.get(archives.getArchivesId());
		
		ProcessRun processRun=processRunService.get(orgArchives.getProcessRun().getRunId());
		processRun.setSubject(archives.getSubject());
		processRunService.save(processRun);
		
		orgArchives.setPrivacyLevel(archives.getPrivacyLevel());
		orgArchives.setSubject(archives.getSubject());
		orgArchives.setArchivesNo(archives.getArchivesNo());
		orgArchives.setTypeName(archives.getTypeName());
		orgArchives.setSendTo(archives.getSendTo());
		orgArchives.setCcTo(archives.getCcTo());
		orgArchives.setShortContent(archives.getShortContent());
		orgArchives.setHandlerUids(archives.getHandlerUids());
		orgArchives.setIssueDep(archives.getIssueDep());
		orgArchives.setSignDate(archives.getSignDate());
		orgArchives.setReceiveDate(archives.getReceiveDate());
		orgArchives.setUnPublicReasons(archives.getUnPublicReasons());

		String fileIds = getRequest().getParameter("fileIds");
		Set archivesAttachments = new HashSet();
		if (StringUtils.isNotEmpty(fileIds)) {
			String[] files = fileIds.split(",");
			if (files.length > 0) {
				for (int i = 0; i < files.length; i++) {
					FileAttach fa = fileAttachService.get(Long.valueOf(files[i]));
					archivesAttachments.add(fa);
				}
			}
		}
		orgArchives.setArchivesFiles(archivesAttachments);
		
		archivesService.save(orgArchives);
		setJsonString("{success:true,archivesId:" + orgArchives.getArchivesId()+ "}");
		return SUCCESS;
	}
	
	public String updateMainFiles() {
		Archives archives = archivesService.get(archivesId);
		String isPublic=getRequest().getParameter("isPublic");
		String ccTo=getRequest().getParameter("ccTo");
		String sendTo=getRequest().getParameter("sendTo");
		String isStandard=getRequest().getParameter("isStandard");
		String isShared=getRequest().getParameter("isShared");
		String isReserveNo=getRequest().getParameter("isReserveNo");
		archives.setIsPublic(StringUtil.nullObject2Short(isPublic));
		archives.setIsStandard(StringUtil.nullObject2Short(isStandard));
		archives.setIsShared(StringUtil.nullObject2Integer(isShared));
		archives.setIsReserveNo(StringUtil.nullObject2Integer(isReserveNo));
		archives.setCcTo(ccTo);
		archives.setSendTo(sendTo);
		archives = archivesService.save(archives);
		return SUCCESS;
	}
}
